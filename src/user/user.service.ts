import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User } from './user.schema';
import { REDIS_SERVICE } from '../redis.module';
import { ClientProxy } from '@nestjs/microservices';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserService {
  userModel: import('mongoose').Model<any, unknown, unknown, {}, any, any>;
  constructor(
    @InjectConnection('users') private connection: Connection,
    @Inject(REDIS_SERVICE) private messageClient: ClientProxy,
  ) {
    this.userModel = this.connection.model(User.name);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(userInfo: FindUserDto) {
    return this.userModel.findOne(userInfo);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    return deletedUser;
  }
}
