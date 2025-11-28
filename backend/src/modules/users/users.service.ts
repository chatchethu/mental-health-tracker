import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string | Types.ObjectId): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string | Types.ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!existingUser) throw new NotFoundException(`User with ID ${id} not found`);
    return existingUser;
  }

  async updateRefreshToken(userId: string | Types.ObjectId, refreshToken: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }

  async updatePassword(userId: string | Types.ObjectId, newPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { password: newPassword }).exec();
  }

  async remove(id: string | Types.ObjectId): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`User with ID ${id} not found`);
  }

  async updatePreferences(userId: string | Types.ObjectId, preferences: any): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, { $set: { preferences } }, { new: true })
      .exec();
  }

  async updateSettings(userId: string | Types.ObjectId, settings: any): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, { $set: { settings } }, { new: true })
      .exec();
  }

  async deactivateUser(userId: string | Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { isActive: false }).exec();
  }

  async activateUser(userId: string | Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { isActive: true }).exec();
  }
}
