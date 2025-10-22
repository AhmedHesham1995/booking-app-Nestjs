import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema()
export class Class {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  instructor: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true, default: 0 })
  capacity: number;

  @Prop({ required: true, default: 0 })
  bookedCount: number;

  @Prop({ required: true, default: 1 })
  creditsRequired: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
