import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"

export function authenticateToken(req: Request, res: Response, next: NextFunction) {

  const bearerHeader = req.headers["authorization"];

  try {
    const decode = jwt.verify(bearerHeader!, "wel1ing7");
    //console.log(decode);
    next();
  } catch (error) {
    return res.status(401).send({ message: "falha na autenticacao" });
  }
}