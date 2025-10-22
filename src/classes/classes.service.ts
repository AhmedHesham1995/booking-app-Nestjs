import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, ClassDocument } from '../schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const classData = {
      ...createClassDto,
      startTime: new Date(createClassDto.startTime),
      endTime: new Date(createClassDto.endTime),
    };

    const createdClass = await this.classModel.create(classData);
    return createdClass.toObject();
  }

  async findAll(): Promise<Class[]> {
    const classes = await this.classModel.find().sort({ startTime: 1 }).exec();
    return classes.map((cls) => cls.toObject());
  }

  async findById(id: string): Promise<Class> {
    const classItem = await this.classModel.findById(id);
    if (!classItem) {
      throw new NotFoundException('Class not found');
    }
    return classItem.toObject();
  }

  async updateBookedCount(classId: string, change: number): Promise<Class> {
    const updatedClass = await this.classModel.findByIdAndUpdate(
      classId,
      { $inc: { bookedCount: change } },
      { new: true },
    );

    if (!updatedClass) {
      throw new NotFoundException('Class not found');
    }
    return updatedClass.toObject();
  }
}
