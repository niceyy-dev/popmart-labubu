import { Request, Response, Router } from "express";
import { LabubuService } from "../services";
import { ApiErrorCode } from "../utils/api-error-code.enum";
import * as express from "express";

export class LabubuController {
  private static instance: LabubuController;

  private constructor() {}

  public static getInstance(): LabubuController {
    if (LabubuController.instance === undefined) {
      LabubuController.instance = new LabubuController();
    }
    return LabubuController.instance;
  }

  async createLabubu(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const data = req.body;
    const result = await LabubuService.getInstance().createLabubu(data);
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

  async updateLabubu(req: express.Request, res: express.Response) {
    const id = req.params.id;

    const data = req.body;
    const result = await LabubuService.getInstance().updateLabubu(id, data);
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

  async deleteLabubu(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await LabubuService.getInstance().deleteLabubu(id);
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

  async getLabubuById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await LabubuService.getInstance().getLabubuById(id);
    if (result === null) {
      res.status(404).end();
      return;
    }
    res.json(result);
  }

  async getAllLabubus(req: express.Request, res: express.Response) {
    const result = await LabubuService.getInstance().getAllLabubus();
    if (result === null) {
      res.status(404).end();
      return;
    }
    res.json(result);
  }

  async searchLabubu(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit
      ? Number.parseInt(req.query.limit as string)
      : 20;
    const offset = req.query.offset
      ? Number.parseInt(req.query.offset as string)
      : 0;

    const labubu = await LabubuService.getInstance().searchLabubus({
      collection: req.query.collection as string,
      name: req.query.name as string,
      color: req.query.color as string,
      rarity: req.query.rarity as string,
      description: req.query.description as string,
      limit: limit,
      offset: offset,
    });

    res.json(labubu);
  }

  buildRouter(): Router {
    const router = Router();
    router.get("/", this.getAllLabubus.bind(this));
    router.get("/search", this.searchLabubu.bind(this));
    router.post("/create", this.createLabubu.bind(this));
    router.patch("/update/:id", this.updateLabubu.bind(this));
    router.delete("/:id", this.deleteLabubu.bind(this));
    router.get("/id/:id", this.getLabubuById.bind(this));

    return router;
  }
}
