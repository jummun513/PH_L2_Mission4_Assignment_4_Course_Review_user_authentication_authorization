/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TPasswordChange, TUserLogin, TUserRegister } from './auth.interface';
import { AuthUserRegister } from './auth.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const registerUserIntoDB = async (user: Partial<TUserRegister>) => {
  const result = await AuthUserRegister.create(user);

  // send selective data to frontend
  const sendData = result.toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.isDeleted;
      delete ret.password;
      delete ret.__v;
      delete ret.passwordChangeTrack;
    },
  });
  return sendData;
};

const loginUserFromDB = async (payload: TUserLogin) => {
  const isUserExist = await AuthUserRegister.isUserExistByUsername(
    payload?.username,
  );

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This username does not exist!');
  }

  if (isUserExist?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!');
  }

  const isPasswordMatch = await AuthUserRegister.isPasswordMatched(
    payload?.password,
    isUserExist?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Wrong Password!');
  }

  // create signIn token
  const jwtPayload = {
    _id: (isUserExist as any)._id,
    role: isUserExist.role,
    email: isUserExist.email,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '30d',
  });
  // send selective data to frontend
  const sendData = (isUserExist as any).toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc: any, ret: any) => {
      delete ret.isDeleted;
      delete ret.password;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.passwordChangeTrack;
    },
  });

  return { user: sendData, token: accessToken };
};

const changePasswordIntoDB = async (
  payload: TPasswordChange,
  user: JwtPayload,
) => {
  const isUserExist = await AuthUserRegister.findOne({
    _id: user?._id,
    role: user?.role,
  });

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user does not exist!');
  }

  if (isUserExist?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!');
  }

  // check current password is matched current stored password
  const isCurrentPasswordMatchWithStoredPassword =
    await AuthUserRegister.isPasswordMatched(
      payload?.currentPassword,
      isUserExist?.password,
    );

  if (!isCurrentPasswordMatchWithStoredPassword) {
    throw new Error('passwordError');
  }

  // check new password is matched with current stored password
  const isNewPasswordMatchWithStoredPassword =
    await AuthUserRegister.isPasswordMatched(
      payload?.newPassword,
      isUserExist?.password,
    );
  if (isNewPasswordMatchWithStoredPassword) {
    throw new Error('passwordError');
  }

  // check new password is matched with last two store password
  if (isUserExist?.passwordChangeTrack?.length > 0) {
    // Using Promise.all() to handle async operations inside map
    await Promise.all(
      isUserExist.passwordChangeTrack.map(async d => {
        const isNewPasswordMatchWithPrevPassword =
          await AuthUserRegister.isPasswordMatched(
            payload?.newPassword,
            d?.prevPassword,
          );
        if (isNewPasswordMatchWithPrevPassword) {
          throw new Error('passwordError');
        }
      }),
    );
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  let result;
  if (isUserExist?.passwordChangeTrack?.length < 2) {
    const storePrevPassword = [
      { prevPassword: isUserExist.password, storedTime: new Date().getTime() },
    ];
    result = await AuthUserRegister.findOneAndUpdate(
      { _id: user._id },
      {
        password: newHashedPassword,
        $addToSet: {
          passwordChangeTrack: { $each: storePrevPassword },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  } else {
    // Find the object with the minimum storedTime using reduce
    const minTimeObject = isUserExist?.passwordChangeTrack?.reduce(
      (min, current) => {
        return new Date(Number(current.storedTime)) <
          new Date(Number(min.storedTime))
          ? current
          : min;
      },
      isUserExist?.passwordChangeTrack[0],
    );

    // Filter out the object with the minimum storedTime
    const filteredArray = isUserExist?.passwordChangeTrack
      ?.filter(obj => obj === minTimeObject)
      .map(d => d.storedTime);

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      await AuthUserRegister.findOneAndUpdate(
        { _id: user._id },
        {
          $pull: {
            passwordChangeTrack: { storedTime: { $in: filteredArray } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      result = await AuthUserRegister.findOneAndUpdate(
        { _id: user._id },
        {
          password: newHashedPassword,
          $addToSet: {
            passwordChangeTrack: {
              $each: [
                {
                  prevPassword: isUserExist.password,
                  storedTime: new Date().getTime(),
                },
              ],
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error('passwordError');
    }
  }

  const sendData = (result as any).toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc: any, ret: any) => {
      delete ret.isDeleted;
      delete ret.passwordChangeTrack;
      delete ret.password;
      delete ret.__v;
    },
  });

  return sendData;
};

export const authService = {
  registerUserIntoDB,
  loginUserFromDB,
  changePasswordIntoDB,
};
