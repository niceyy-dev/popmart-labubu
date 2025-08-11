import { Request, Response, Router } from "express";
import { UserService } from "../services";
import { ApiErrorCode } from "../utils/api-error-code.enum";
import * as express from "express";
import { SessionProps } from "../models";

export class UserController {
  private static instance: UserController;

  private constructor() {}

  public static getInstance(): UserController {
    if (UserController.instance === undefined) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  async createUser(req: express.Request, res: express.Response): Promise<void> {
    const data = req.body;
    const result = await UserService.getInstance().createUser(data);
    if (result === ApiErrorCode.invalidParameters) {
      res.status(400).end();
      return;
    }
    if (result === ApiErrorCode.alreadyExists) {
      res.status(409).end();
      return;
    }
    res.json(result);
  }
  async logIn(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const session = await UserService.getInstance().logIn({
      email: data.email,
      password: data.password,
      platform: req.headers["user-agent"],
    });
    if (session === ApiErrorCode.notFound) {
      res.status(404).end();
      return;
    }
    res.json({
      token: (session as SessionProps)._id,
    });
  }

  async updateUser(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;
    const result = await UserService.getInstance().updateUser(id, data);
    if (result === ApiErrorCode.invalidParameters) {
      res.status(400).end();
      return;
    }
    if (result === ApiErrorCode.notFound) {
      res.status(404).end();
      return;
    }
    res.json(result);
  }

  async deleteUser(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await UserService.getInstance().deleteUser(id);
    if (result === ApiErrorCode.notFound) {
      res.status(404).end();
      return;
    }
    if (result === ApiErrorCode.invalidParameters) {
      res.status(400).end();
      return;
    }
    res.status(200).end();
  }

  async getUserById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await UserService.getInstance().getUserById(id);
    if (result === null) {
      res.status(404).end();
      return;
    }
    res.json(result);
  }
  async getAllUsers(req: express.Request, res: express.Response) {
    const result = await UserService.getInstance().getAllUsers();
    if (result === null) {
      res.status(404).end();
      return;
    }
    res.json(result);
  }

  async searchUsers(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit
      ? Number.parseInt(req.query.limit as string)
      : 20;
    const offset = req.query.offset
      ? Number.parseInt(req.query.offset as string)
      : 0;

    const users = await UserService.getInstance().searchUsers({
      address: req.query.address as string,
      firstname: req.query.firstname as string,
      lastname: req.query.lastname as string,
      email: req.query.email as string,
      limit: limit,
      offset: offset,
    });

    res.json(users);
  }
  async getUserByEmail(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string;
    const owner = await UserService.getInstance().getOwnerByEmail(email);
    if (owner === null) {
      res.status(404).end();
      return;
    }
    res.json(owner);
  }

  buildRouter(): Router {
    const router = Router();
    router.get("/", this.getAllUsers.bind(this));
    router.get("/search", this.searchUsers.bind(this));
    router.post("/create", this.createUser.bind(this));
    router.patch("/update/:id", this.updateUser.bind(this));
    router.delete("/:id", this.deleteUser.bind(this));
    router.get("/id/:id", this.getUserById.bind(this));
    router.post("/login", this.logIn.bind(this));
    router.get("/email", this.getUserByEmail.bind(this));
    return router;
  }
}
