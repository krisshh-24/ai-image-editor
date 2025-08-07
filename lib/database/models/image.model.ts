import { Schema, model, models, Document } from "mongoose";

// 1. Define the TypeScript interface
export interface IImage extends Document {
  title: string;
  transformationType: string;
  publicId: string;
  secureURL: string;
  width?: number;
  height?: number;
  config?: object;
  transformationUrl?: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author:{
    _id:string;
    firstName:string,
    lastname:string
  }  // Reference to Users collection
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose schema
const ImageSchema = new Schema<IImage>({
  title: { type: String, required: true },
  transformationType: { type: String, required: true },
  publicId: { type: String, required: true },
  secureURL: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  config: { type: Object },
  transformationUrl: { type: String },
  aspectRatio: { type: String },
  color: { type: String },
  prompt: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "Users" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 3. Create the model or reuse existing one
const Image = models.Image || model<IImage>("Image", ImageSchema);

export default Image;
