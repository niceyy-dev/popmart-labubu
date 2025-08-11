import { LabubuDocument, LabubuModel, LabubuProps } from "../models";
import { ApiErrorCode } from "../utils/api-error-code.enum";
import { Types, FilterQuery } from "mongoose";
import { UserService } from "./user.service";

export class LabubuService {
  private static instance: LabubuService;

  private constructor() {}

  public static getInstance(): LabubuService {
    if (LabubuService.instance === undefined) {
      LabubuService.instance = new LabubuService();
    }
    return LabubuService.instance;
  }

  async createLabubu(
    create: LabubuCreate
  ): Promise<LabubuDocument | ApiErrorCode> {
    try {
      const exist = await LabubuModel.findOne({ address: create.address });
      if (exist) {
        return ApiErrorCode.alreadyExists;
      }
      console.log("Creating Labubu with owner:", create.owner);
      const owner = await UserService.getInstance().getOwnerByEmail(
        create.owner
      );

      if (!owner) {
        return ApiErrorCode.notFound;
      }
      const model = new LabubuModel({
        address: create.address,
        name: create.name,
        collection: create.collection,
        date: create.date,
        owner,
        location: create.location,
        img: create.img,
        rarity: create.rarity,
        color: create.color,
        description: create.description,
        outofstock: create.outofstock,
        hex: create.hex,
        mystery: create.mystery,
      });
      const labubu = await model.save();
      return labubu;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }

  async deleteLabubu(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const labubu = await LabubuModel.findByIdAndDelete(id);
    if (labubu === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }

  async getLabubuById(id: string): Promise<LabubuDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const labubu = await LabubuModel.findById(id);
    if (labubu === null) {
      return null;
    }
    return labubu;
  }

  async getAllLabubus(): Promise<LabubuDocument[] | null> {
    const labubus = await LabubuModel.find();
    return labubus;
  }

  async updateLabubu(
    id: string,
    update: LabubuUpdate
  ): Promise<LabubuDocument | ApiErrorCode> {
    try {
      const labubu = await LabubuModel.findByIdAndUpdate(id, update, {
        returnDocument: "after",
      });
      if (labubu === null) {
        return ApiErrorCode.notFound;
      }
      return labubu;
    } catch (error) {
      return ApiErrorCode.failed;
    }
  }
  async searchLabubus(
    search: LabubuSearch
  ): Promise<LabubuDocument[] | ApiErrorCode> {
    const filter: FilterQuery<LabubuDocument> = {};

    if (search.collection !== undefined) {
      filter.collection = { $regex: search.collection, $options: "i" };
    }
    if (search.name !== undefined) {
      filter.name = { $regex: search.name, $options: "i" };
    }
    if (search.color !== undefined) {
      filter.color = { $regex: search.color, $options: "i" };
    }
    if (search.description !== undefined) {
      filter.description = { $regex: search.description, $options: "i" };
    }
    if (search.rarity !== undefined) {
      filter.rarity = { $regex: search.rarity, $options: "i" };
    }

    const query = LabubuModel.find(filter);

    if (search.limit !== undefined) {
      query.limit(search.limit);
    }
    if (search.offset !== undefined) {
      query.skip(search.offset);
    }

    return query.exec();
  }
}

export interface LabubuCreate {
  readonly address?: string;
  readonly name?: string;
  readonly collection?: string;
  readonly date?: string;
  readonly owner?: string;
  readonly location?: string;
  readonly img?: string;
  readonly rarity?: string;
  readonly color?: string;
  readonly description?: string;
  readonly outofstock?: boolean;
  readonly hex?: string;
  readonly mystery?: boolean;
}
export interface LabubuSearch {
  readonly collection?: string;
  readonly name?: string;
  readonly color?: string;
  readonly outofstock?: boolean; // Convert string to boolean
  readonly description?: string;
  readonly rarity?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface LabubuUpdate {
  readonly name?: string;
  readonly collection?: string;
  readonly date?: string;
  readonly owner?: string;
  readonly location?: string;
  readonly img?: string;
  readonly rarity?: string;
  readonly color?: string;
  readonly description?: string;
  readonly outofstock?: boolean;
  readonly hex?: string;
  readonly mystery?: string;
}
