import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface RoleProps {
  _id: string;
  name: string;
  accessList: string[];
}

export type RoleDocument = RoleProps & Document;

const roleSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    accessList: [
      {
        type: Schema.Types.String,
        required: true,
      },
    ],
  },
  {
    versionKey: false,
  }
);

export const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
