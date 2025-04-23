import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  createdAt: Date;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);