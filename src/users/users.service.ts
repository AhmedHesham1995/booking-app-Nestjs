import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addCredits(userId: string, amount: number): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { credits: amount } },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser.toObject();
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toObject();
  }
}
