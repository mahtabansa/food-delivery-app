
import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { addItem, deleteItem, EditItem, getItemBycity, getItemById, getItemsByShopId, itemRating, searchItems } from '../controlers/item.controller.js';
const itemRouter = express.Router();

itemRouter.post('/add-item',isAuth,upload.single("image"),addItem);

itemRouter.put('/edit-item/:itemId',isAuth,upload.single("image"),EditItem);
itemRouter.get("/search-item",isAuth,searchItems)
itemRouter.get('/get-by-id/:itemId',isAuth,getItemById);
itemRouter.get('/delete-item/:itemId',isAuth,deleteItem);
itemRouter.get('/get-item-bycity/:city',isAuth,getItemBycity)
itemRouter.get("/get-items-by-ShopId/:shopId",isAuth,getItemsByShopId)
itemRouter.get("/search-item",isAuth,searchItems)
itemRouter.post("/rating",isAuth,itemRating)


export {itemRouter}