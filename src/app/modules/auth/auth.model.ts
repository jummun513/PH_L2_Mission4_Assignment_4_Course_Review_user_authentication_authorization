import { Schema, model } from 'mongoose';
import { TUserRegister, UserRegistrationModel } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const userRegisterSchema = new Schema<TUserRegister, UserRegistrationModel>(
  {
    username: {
      type: String,
      required: [true, 'User Name is required.'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: false,
      default: 'user',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// mongoose document middleware
userRegisterSchema.pre('save', async function (next) {
  const result = await AuthUserRegister.findOne(
    { $or: [{ email: this.email }, { username: this.username }] },
    { _id: 0, email: 1, username: 1 },
  );
  if (result) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `${result.username} or ${result.email} is already exist.`,
    );
  }
  // hashing password and before save to DB
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userRegisterSchema.statics.isUserExistByUsername = async function (
  username: string,
) {
  return AuthUserRegister.findOne({ username });
};

userRegisterSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

export const AuthUserRegister = model<TUserRegister, UserRegistrationModel>(
  'user',
  userRegisterSchema,
);
