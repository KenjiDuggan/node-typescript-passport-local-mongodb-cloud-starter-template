import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions } from "mongoose";
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import authRouter from './routes/auth';
 
/**
 * -------------- ENV VARIABLES ----------------
 */
dotenv.config();
const PORT = process.env.PORT || 3001;

mongoose.connect(`${process.env.MONGODB_URL_PART1!}${process.env.MONGODB_USERNAME!}:${process.env.MONGODB_PASSWORD!}${process.env.MONGODB_URL_PART2!}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions, (err) => {
    if (err) throw err;
    console.log("Connected To Mongo")
});
 
/**
 * -------------- INSTANTIATION OF EXPRESS OBJECT ----------------
 */
const app: Express = express();
    
/**
 * -------------- DEFAULT MIDDLEWARES ----------------
 */
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(
    session({
      secret: "secretcode",
      resave: true,
      saveUninitialized: true,
    })
);
 

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- AUTH ROUTER ----------------
 */
app.use('/auth', authRouter);

/**
 * -------------- OTHER ROUTERS ----------------
 */
// app.use('todos', todosRouter);


/**
 * -------------- SERVER FAILURE REDIRECT ----------------
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});


/**
 * -------------- APP LISTENING ON PORT, ENDPOINTS ARE NOW ACTIVE ----------------
 */
app.listen(PORT, () => { console.log("The server is listening on port: " + PORT); });
