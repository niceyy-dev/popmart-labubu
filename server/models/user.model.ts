import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface UserProps {
  _id: string;
  address: string;
  lastname: string;
  firstname: string;
  email: string;
  profile: string;
}

export type UserDocument = UserProps & Document;

const userSchema = new Schema(
  {
    address: {
      type: Schema.Types.String,
      unique: true,
    },
    firstname: {
      type: Schema.Types.String,
      // required: true,
    },
    lastname: {
      type: Schema.Types.String,
      // required: true,
    },
    email: {
      type: Schema.Types.String,
      // required: true,
    },
    profile: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
