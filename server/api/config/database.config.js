import mongoose from 'mongoose';
import { DB } from '../enums/db.enums.js';
import { config } from 'dotenv';

// Load env vars
config();

export default () => {
  mongoose
    .connect(`mongodb://${process.env.MONGODB_SERVER}?authSource=admin`)
    .then(() => console.log(DB.SUCCESS.DB_CONNECTED))
    .catch((err) => console.error(DB.ERROR.DB_NOT_CONNECTED, err));
};
