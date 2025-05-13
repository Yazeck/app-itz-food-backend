import express from'express';
import { createUser, getUser, updateUser } from '../controllers/userController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateUserRequest } from '../middleware/validation';


const router = express.Router();

router.post('/',jwtCheck, createUser);
router.post('/', jwtCheck, jwtParse, updateUser, validateUserRequest);
router.put('/', jwtCheck, jwtParse, validateUserRequest, updateUser);
router.get('/', jwtCheck, jwtParse, getUser)
export default router;  