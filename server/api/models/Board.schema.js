import { Schema, model } from 'mongoose';

const BoardSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Board', BoardSchema);
