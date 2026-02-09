
import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { addItem, EditItem } from '../controlers/item.controller.js';
const itemRouter = express.Router();

itemRouter.post('/add-item',isAuth,upload.single("image"),addItem);
itemRouter.post('edit-item',isAuth,upload.single("image"),EditItem);
export {itemRouter}