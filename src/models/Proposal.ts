import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  images: string[];
}

export interface IProposal extends Document {
  name: string;
  date: Date;
  status: 'draft' | 'sent' | 'viewed' | 'accepted';
  clientName: string;
  clientEmail: string;
  products: IProduct[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  images: [{ type: String }]
});

const ProposalSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'viewed', 'accepted'],
    default: 'draft'
  },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  products: [ProductSchema],
  totalAmount: { type: Number, required: true },
}, {
  timestamps: true
});

export default mongoose.model<IProposal>('Proposal', ProposalSchema);