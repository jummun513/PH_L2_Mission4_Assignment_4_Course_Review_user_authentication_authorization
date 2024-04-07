import { Types } from 'mongoose';

export type TTag = {
  name: string;
  isDeleted: boolean;
};

export type TDetail = {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
};

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: [TTag];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: number;
  details: TDetail;
  createdBy: Types.ObjectId;
};
