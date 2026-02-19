
import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { addItem, deleteItem, EditItem, getItemBycity, getItemById } from '../controlers/item.controller.js';
const itemRouter = express.Router();

itemRouter.post('/add-item',isAuth,upload.single("image"),addItem);

itemRouter.put('/edit-item/:itemId',isAuth,upload.single("image"),EditItem);

itemRouter.get('/get-by-id/:itemId',isAuth,getItemById);
itemRouter.get('/delete-item/:itemId',isAuth,deleteItem);
itemRouter.get('/get-item-bycity/:city',isAuth,getItemBycity)
export {itemRouter}