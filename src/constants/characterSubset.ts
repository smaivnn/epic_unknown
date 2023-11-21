import { ObjectId } from 'mongodb';

export type CharacterSubset = {
  _id: ObjectId;
  name: string;
  userId: ObjectId;
  stats: any[];
};
