import { Router } from 'express';
import { createUser, fetchUsers, fetchAUser, updateUser, deleteUser } from '../controllers/userController';



const userRouter = Router();

userRouter.post('/', createUser);

userRouter.get('/', fetchUsers)

userRouter.get('/:email', fetchAUser)

userRouter.put('/:email', updateUser)

userRouter.delete('/', deleteUser)

userRouter.delete('/:email', deleteUser)

export { userRouter as userRoutes };
