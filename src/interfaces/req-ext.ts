import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface RequestExt extends Request {
    user: number;
    token: string;
}
