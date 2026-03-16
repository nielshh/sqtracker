import express from "express";
import { handleTorznabRequest } from "../controllers/torznab";

const router = express.Router();

export default (tracker) => {
  router.get("/", handleTorznabRequest(tracker));
  return router;
};
