import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { Class, ClassSchema } from '../schemas/class.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Class.name, schema: ClassSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
