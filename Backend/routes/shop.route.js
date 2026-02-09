import express from 'express'

import {isAuth} from '../middlewares/isAuth.js'
import { createEditShop, getMyshop } from '../controlers/shop.controller.js';
import { upload } from '../middlewares/multer.js';
const shopRouter = express.Router();
shopRouter.post('/create-edit-shop',isAuth,upload.single("image"),createEditShop);
shopRouter.get('/get-my',isAuth,getMyshop);

export { shopRouter }