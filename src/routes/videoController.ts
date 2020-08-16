import { Request, Response, Router } from "express";
let router = Router();
import { scanFiles } from "../service/Files/fileService";
import { getListOfFilesInDB } from "../models/files/files";
router.get("/scan", async (req: Request, res: Response) => {
  scanFiles()
    .then((result: any) => {
      res.send(result);
    })
    .catch((err: any) => {
      res.status(500).send(err.message);
    });
});

router.get("/getVideos", async (req: Request, res: Response) => {
  getListOfFilesInDB()
    .then((result: any) => {
      res.send(result);
    })
    .catch((err: any) => {
      res.status(500).send(err.message);
    });
});

export default router;
