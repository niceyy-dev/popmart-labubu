import {
  SessionDocument,
  SessionModel,
  UserDocument,
  UserModel,
  UserProps,
} from "../models";
import { ApiErrorCode } from "../utils/api-error-code.enum";
import { Types, FilterQuery } from "mongoose";
import { RoleService } from "./role.service";
import { SecurityUtils } from "../utils";

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (UserService.instance === undefined) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(create: UserCreate): Promise<UserDocument | ApiErrorCode> {
    try {
      const exist = await UserModel.findOne({ address: create.address });
      if (exist) {
        return ApiErrorCode.alreadyExists;
      }
      const role = await RoleService.getInstance().getRoleByName(create.role);
      if (!role) {
        return ApiErrorCode.notFound;
      }
      const model = new UserModel({
        address: create.address,
        firstname: create.firstname,
        lastname: create.lastname,
        email: create.email,
        password: SecurityUtils.sha256(create.password),
        profile: create.profile,
        role,
      });
      const user = await model.save();
      return user;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }

  async logIn(log: UserLogIn): Promise<SessionDocument | ApiErrorCode> {
    const user = await UserModel.findOne({
      email: log.email,
      password: SecurityUtils.sha256(log.password),
    });
    if (user === null) {
      return ApiErrorCode.notFound;
    }
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 86_400_000 * 7);
    const model = new SessionModel({
      user: user._id,
      platform: log.platform,
      expirationDate: expirationDate,
    });
    const session = await model.save();
    user.sessions.push(session._id);
    await user.save();
    return session;
  }

  async getUserByToken(token: string): Promise<UserProps | ApiErrorCode> {
    if (!Types.ObjectId.isValid(token)) {
      return ApiErrorCode.invalidParameters;
    }
    const session = await SessionModel.findOne({
      _id: token,
      expirationDate: {
        $gte: new Date(),
      },
    }).populate({
      path: "user",
      populate: {
        path: "role",
        populate: {
          path: "parent",
        },
      },
    });
    if (session === null) {
      return ApiErrorCode.notFound;
    }
    return session.user as UserProps;
  }

  async deleteUser(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const user = await UserModel.findByIdAndDelete(id);
    if (user === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await UserModel.findById(id);
    if (user === null) {
      return null;
    }
    return user;
  }

  async getAllUsers(): Promise<UserDocument[] | null> {
    const users = await UserModel.find();
    return users;
  }

  async updateUser(
    id: string,
    update: UserUpdate
  ): Promise<UserDocument | ApiErrorCode> {
    try {
      const user = await UserModel.findByIdAndUpdate(id, update, {
        returnDocument: "after",
      });
      if (user === null) {
        return ApiErrorCode.notFound;
      }
      return user;
    } catch (error) {
      return ApiErrorCode.failed;
    }
  }
  async searchUsers(
    search: UserSearch
  ): Promise<UserDocument[] | ApiErrorCode> {
    const filter: FilterQuery<UserDocument> = {};

    if (search.address !== undefined) {
      filter.address = { $regex: search.address, $options: "i" };
    }
    if (search.firstname !== undefined) {
      filter.firstname = { $regex: search.firstname, $options: "i" };
    }
    if (search.lastname !== undefined) {
      filter.lastname = { $regex: search.lastname, $options: "i" };
    }
    if (search.email !== undefined) {
      filter.email = { $regex: search.email, $options: "i" };
    }

    const query = UserModel.find(filter);

    if (search.limit !== undefined) {
      query.limit(search.limit);
    }
    if (search.offset !== undefined) {
      query.skip(search.offset);
    }

    return query.exec();
  }
}

export interface UserCreate {
  readonly address?: string;
  readonly firstname?: string;
  readonly lastname?: string;
  readonly email?: string;
  readonly password?: string;
  readonly profile?: string;
  readonly role?: string;
}
export interface UserSearch {
  readonly address?: string;
  readonly firstname?: string;
  readonly lastname?: string;
  readonly email?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface UserUpdate {
  readonly firstname?: string;
  readonly lastname?: string;
  readonly email?: string;
  readonly profile?: string;
}

export interface UserLogIn {
  email: string;
  password: string;
  platform?: string;
}
