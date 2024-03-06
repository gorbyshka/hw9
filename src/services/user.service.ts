import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async createUser(email: string, password: string): Promise<User> {

    try { return await new this.userModel({ email, password }).save() }

    catch (e) { throw new Error }

  }

  async findUserByEmail(email: string): Promise<User | null> {

    try { return await this.userModel.findOne({ email }).exec() }
    catch (e) { throw new Error }

  }

  async findUserById(id: string): Promise<User | null> {

    try { return await this.userModel.findById(id).exec() }

    catch (e) { throw new Error }
    
  }

}
