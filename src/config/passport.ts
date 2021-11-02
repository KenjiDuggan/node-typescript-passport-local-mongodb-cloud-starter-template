import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import { NativeError } from 'mongoose';
import { UserInterface, DatabaseUserInterface } from '../interfaces/IUser';
import User from '../models/User';

/**
 * -------------- PASSPORT-LOCAL CONFIG ----------------
 */
 const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: NativeError, user: DatabaseUserInterface) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err: NativeError, result: boolean) => {
            if (err) throw err;
            if (result === true) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    });
}));

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
    User.findOne({ _id: id }, (err: NativeError, user: DatabaseUserInterface) => {
        const userInformation: UserInterface = {
            username: user.username,
            isAdmin: user.isAdmin,
            _id: user._id
        };
        done(err, userInformation);
    });
});
