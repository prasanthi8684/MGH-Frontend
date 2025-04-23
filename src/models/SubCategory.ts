import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory extends Document {
  name: string;
  category: string;
  createdAt: Date;
}

const SubCategorySchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
}, {
  timestamps: true
});

SubCategorySchema.index({ category: 1, name: 1 }, { unique: true });

export default mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);