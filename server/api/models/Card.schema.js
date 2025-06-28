import { Schema, model } from 'mongoose';

const CardSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
  order: {
    // To maintain the order of cards within a list
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Card', CardSchema);
