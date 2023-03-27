import { Response } from "express";


export function badDataError(res: Response, message = 'bad/data') {
  res.statusMessage = message
  res.status(400).end();
}