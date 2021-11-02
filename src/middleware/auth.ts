import { Request, Response, NextFunction } from 'express';
import { DatabaseUserInterface } from '../interfaces/IUser';
import User from '../models/User';

/**
 * -------------- USER MIDDLEWARE - CHECK IF ADMIN ATTRIBUTE OR NOT ----------------
 */
export const isAdministratorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { user }: any = req;
    if (user) {
        User.findOne({ username: user.username }, (err: any, doc: DatabaseUserInterface) => {
        if (err) throw err;
        if (doc?.isAdmin) {
            next();
        }
        else {
            res.send('Sorry, you must be an admin in order to perform this action.');
        }
        })
    }
    else {
        res.send('Sorry, you are not logged in right now.');
    }
}