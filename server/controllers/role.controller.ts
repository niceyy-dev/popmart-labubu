import { Request, Response, Router } from "express";
import { RoleService } from "../services";
import { ApiErrorCode } from "../utils/api-error-code.enum";
import * as express from "express";

export class RoleController {
  private static instance: RoleController;

  private constructor() {}

  public static getInstance(): RoleController {
    if (RoleController.instance === undefined) {
      RoleController.instance = new RoleController();
    }
    return RoleController.instance;
  }
  async createRole(req: express.Request, res: express.Response): Promise<void> {
    const data = req.body;
    const result = await RoleService.getInstance().createRole(data);
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
  async updateRole(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;
    const result = await RoleService.getInstance().updateRole(id, data);
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

  async deleteRole(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await RoleService.getInstance().deleteRole(id);
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

  async getRoleByName(req: express.Request, res: express.Response) {
    const { name } = req.params;
    const result = await RoleService.getInstance().getRoleByName(name);
    if (result === null) {
      res.status(404).end();
      return;
    }
    res.json(result);
  }
  buildRouter(): Router {
    const router = Router();
    router.post("/create", this.createRole.bind(this));
    router.patch("/update/:id", this.updateRole.bind(this));
    router.delete("/:id", this.deleteRole.bind(this));
    router.get("/:name", this.getRoleByName.bind(this));

    return router;
  }
}
