"use server"

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import Image from "../database/models/image.model";
import User from "../database/models/user.model";
import { redirect } from "next/navigation";


const PopulateUser=(query:any)=>{
    return query.populate({
        path: "author",
        model : User,
        select:" _id firstName lastName"
    })
}
export async function addImage({image,userId,path}: AddImageParams) {
  try {
    await connectToDatabase();
    const author = await User.findById(userId);
    if (!author) throw new Error("User not found");

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });
    
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}

export async function updateImage({image,userId,path}: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);
    if (!imageToUpdate || imageToUpdate.author.toString() !== userId) throw new Error("Image not found");
    const updatedImage = await Image.findByIdAndUpdate(imageToUpdate._id, image, {
      new: true,
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteImage(imageId:string) {
  try {
    await connectToDatabase();

   await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  }finally {
    redirect("/");
  }
}

export async function getImagebyId(imageId:string) {
  try {
    await connectToDatabase();
    
    const image =await PopulateUser(Image.findById(imageId));
    (!image) && handleError(new Error("Image not found"));

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}