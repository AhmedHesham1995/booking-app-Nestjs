import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Booking } from '../schemas/booking.schema';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a class' })
  @ApiResponse({ status: 201, description: 'Class successfully booked' })
  async create(
    @Request() req,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.create(req.user._id, createBookingDto);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'Return user bookings' })
  async getUserBookings(@Request() req): Promise<Booking[]> {
    return this.bookingsService.getUserBookings(req.user._id);
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking successfully cancelled' })
  async cancel(@Request() req, @Param('id') id: string): Promise<Booking> {
    return this.bookingsService.cancel(id, req.user._id);
  }
}
