import mongoose from 'mongoose';
import { DB_LANG } from '../language/en';
import { config } from 'dotenv';

// Load env vars
config();
// module.exports = () => {
//   mongoose
//     .connect(`mongodb://${process.env.MONGODB_SERVER}?authSource=admin`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     })
//     .then(() => console.log(DB_LANG.SUCCESS.DB_CONNECTED))
//     .catch((err) => console.error(DB_LANG.ERROR.DB_NOT_CONNECTED, err));
// };
