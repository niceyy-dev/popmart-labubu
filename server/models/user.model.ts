import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import { RoleProps } from "./role.model";
import { SessionProps } from "./session.model";

export interface UserProps {
  _id: string;
  address: string;
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  profile: string;
  sessions: (SessionProps | string)[];
  role: string | RoleProps;
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
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    profile: {
      type: Schema.Types.String,
    },
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    role: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
