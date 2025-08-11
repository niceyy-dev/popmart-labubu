import { Types } from "mongoose";
import { RoleDocument, RoleModel } from "../models";
import { ApiErrorCode } from "../utils/api-error-code.enum";

export class RoleService {
  private static instance: RoleService;

  private constructor() {}

  public static getInstance(): RoleService {
    if (RoleService.instance === undefined) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }

  //   public getRoleByName(name: string): Promise<RoleDocument | null> {
  //     return RoleModel.findOne({
  //       name,
  //     }).exec();
  //   }

  public async createRole(
    create: CreateRole
  ): Promise<RoleDocument | ApiErrorCode> {
    try {
      const exist = await RoleModel.findOne({ name: create.name });
      if (exist) {
        return ApiErrorCode.alreadyExists;
      }
      const model = new RoleModel(create);
      const role = await model.save();
      return role;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }
  async updateRole(
    id: string,
    update: UpdateRole
  ): Promise<RoleDocument | ApiErrorCode> {
    try {
      const role = await RoleModel.findByIdAndUpdate(id, update, {
        returnDocument: "after",
      });
      if (role === null) {
        return ApiErrorCode.notFound;
      }
      return role;
    } catch (error) {
      return ApiErrorCode.failed;
    }
  }
  async deleteRole(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const role = await RoleModel.findByIdAndDelete(id);
    if (role === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }

  async getRoleByName(name: string): Promise<RoleDocument | null> {
    const role = await RoleModel.findOne({ name: name });
    if (role === null) {
      return null;
    }
    return role;
  }
  //   public getByName(name: string): Promise<RoleDocument | null> {
  //     return RoleModel.findOne({
  //       name,
  //     }).exec();
  //   }
}

export interface CreateRole {
  readonly name: string;
  readonly accessList?: string[];
  readonly parentName?: string;
}

export interface UpdateRole {
  readonly name?: string;
  readonly accessList?: string[];
  readonly parentName?: string;
}
