import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { Class, ClassDocument } from '../schemas/class.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    userId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    const { classId } = createBookingDto;

    // Check if class exists
    const classItem = await this.classModel.findById(classId);
    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    // Check if user exists and has enough credits
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.credits < classItem.creditsRequired) {
      throw new ConflictException('Insufficient credits');
    }

    // Check if class is full
    if (classItem.bookedCount >= classItem.capacity) {
      throw new ConflictException('Class is full');
    }

    // Check for overlapping bookings
    const overlappingBooking = await this.bookingModel.findOne({
      user: userId,
      status: 'confirmed',
      class: {
        $in: await this.classModel
          .find({
            $or: [
              {
                startTime: { $lt: classItem.endTime },
                endTime: { $gt: classItem.startTime },
              },
            ],
          })
          .distinct('_id'),
      },
    });

    if (overlappingBooking) {
      throw new ConflictException('You have an overlapping class booking');
    }

    // Check if already booked
    const existingBooking = await this.bookingModel.findOne({
      user: userId,
      class: classId,
      status: 'confirmed',
    });

    if (existingBooking) {
      throw new ConflictException('You have already booked this class');
    }

    try {
      // Deduct credits
      await this.userModel.findByIdAndUpdate(userId, {
        $inc: { credits: -classItem.creditsRequired },
      });

      // Update class booked count
      await this.classModel.findByIdAndUpdate(classId, {
        $inc: { bookedCount: 1 },
      });

      // Create booking
      const booking = await this.bookingModel.create({
        user: new Types.ObjectId(userId),
        class: new Types.ObjectId(classId),
        bookedAt: new Date(),
      });

      return booking.toObject();
    } catch (error) {
      // If anything fails, try to revert changes
      await this.userModel.findByIdAndUpdate(userId, {
        $inc: { credits: classItem.creditsRequired },
      });

      await this.classModel.findByIdAndUpdate(classId, {
        $inc: { bookedCount: -1 },
      });

      throw new BadRequestException('Booking failed. Please try again.');
    }
  }

  async cancel(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findOne({
        _id: bookingId,
        user: userId,
        status: 'confirmed',
      })
      .populate('class');

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const classItem = booking.class as Class;
    const now = new Date();
    const classStart = new Date(classItem.startTime);
    const timeDiff = classStart.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Check if cancellation is within 2 hours
    if (hoursDiff < 2) {
      throw new BadRequestException(
        'Cannot cancel within 2 hours of class start',
      );
    }

    try {
      // Refund credits
      await this.userModel.findByIdAndUpdate(userId, {
        $inc: { credits: classItem.creditsRequired },
      });

      // Update class booked count
      await this.classModel.findByIdAndUpdate(classItem._id.toString(), {
        $inc: { bookedCount: -1 },
      });

      // Update booking status
      const updatedBooking = await this.bookingModel.findByIdAndUpdate(
        bookingId,
        {
          status: 'cancelled',
          cancelledAt: new Date(),
          refundProcessed: true,
        },
        { new: true },
      );

      if (!updatedBooking) {
        throw new NotFoundException('Booking not found after update');
      }

      return updatedBooking.toObject();
    } catch (error) {
      throw new BadRequestException('Cancellation failed. Please try again.');
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const bookings = await this.bookingModel
      .find({ user: userId })
      .populate('class')
      .sort({ bookedAt: -1 })
      .exec();

    return bookings.map((booking) => booking.toObject());
  }
}
