
import { Request } from "express";
import { ApplicationUser } from "./applicationUser"; 

export interface RequestWithSession extends Request {
  applicationUser?: ApplicationUser;
}