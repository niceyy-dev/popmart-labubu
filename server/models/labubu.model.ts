import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface LabubuProps {
  _id: string;
  address: string;
  name: string;
  collection: string;
  owner: string;
  date: string;
  location: string;
  img: string;
  rarity: string;
  color: string;
  description: string;
  outofstock: boolean;
  hex: string;
  mystery: boolean;
}

export type LabubuDocument = LabubuProps & Document;

const labubuSchema = new Schema(
  {
    address: {
      type: Schema.Types.String,
      unique: true,
    },
    collection: {
      type: Schema.Types.String,
      // required: true,
    },
    name: {
      type: Schema.Types.String,
      // required: true,
    },
    owner: {
      type: Schema.Types.String,
      ref: "Users",
      // required: true,
    },
    date: {
      type: Schema.Types.String,
    },
    location: {
      type: Schema.Types.String,
    },
    img: {
      type: Schema.Types.String,
    },
    color: {
      type: Schema.Types.String,
    },
    rarity: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
    outofstock: {
      type: Schema.Types.Boolean,
      default: false,
    },
    hex: {
      type: Schema.Types.String,
    },
    mystery: {
      type: Schema.Types.Boolean,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const LabubuModel = mongoose.model<LabubuDocument>(
  "Labubu",
  labubuSchema
);
