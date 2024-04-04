/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface TUserRegister {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isDeleted: boolean;
}

export type TUserLogin = {
  username: string;
  password: string;
};

export interface UserRegistrationModel extends Model<TUserRegister> {
  isUserExistByUsername(username: string): Promise<TUserRegister>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
