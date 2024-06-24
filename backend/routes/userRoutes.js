import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    UpdateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from '../controllers/userController.js'

const router = express.Router();

router.route('/').post(registerUser).get(getUsers);
router.post('/logout',logoutUser);
router.post('/login',authUser);
router.route('/profile').get(getUserProfile).put(UpdateUserProfile);
router.route('/:id').delete(deleteUser).get(getUserById).put(updateUser);



export default router;