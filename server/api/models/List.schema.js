import { Schema, model } from 'mongoose';

const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  order: {
    // To maintain the order of lists within a board
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('List', ListSchema);
