import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Class } from './class.schema';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  class: Class;

  @Prop({ required: true })
  bookedAt: Date;

  @Prop({ default: 'confirmed' })
  status: string; // confirmed, cancelled

  @Prop()
  cancelledAt: Date;

  @Prop({ default: false })
  refundProcessed: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
