import { Router } from 'express';
const router = Router();
import passport from 'passport';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { NativeError } from 'mongoose';
import { UserInterface, DatabaseUserInterface } from '../interfaces/IUser';
import { isAdministratorMiddleware } from '../middleware/auth';

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('success');
});

router.post('/register', async (req, res) => {
    const { username, password } = req?.body;
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        res.send('Improper value types were provided, please try again.');
        return;
    }
    User.findOne({ username }, async (err: NativeError, doc: DatabaseUserInterface) => {
        if (err) throw err;
        if (doc) res.send('This user already exists.');
        if (!doc) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
        });
        await newUser.save();
        res.send('success');
        }
    })
});
  
router.post('/delete-user', isAdministratorMiddleware, async (req, res) => {
    const { id } = req?.body;
    await User.findByIdAndDelete(id, (err: NativeError) => {
        if (err) throw err;
    });
    res.send('success');
});


/**
 * -------------- GET ROUTES ----------------
 */

router.get('/user', (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('success');
});

router.get('/users', isAdministratorMiddleware, async (req, res) => {
    await User.find({}, (err: NativeError, data: DatabaseUserInterface[]) => {
        if (err) throw err;
        const filteredUsers: UserInterface[] = [];
        data.forEach((item: DatabaseUserInterface) => {
        const userInformation = {
            _id: item._id,
            username: item.username,
            isAdmin: item.isAdmin
        }
        filteredUsers.push(userInformation);
        });
        res.send(filteredUsers);
    })
});

  
export default router;