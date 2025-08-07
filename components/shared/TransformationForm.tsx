"use client";

import { use, useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { CustomField } from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { updateCredits } from "@/lib/actions/user.actions";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/image.action";
import { useRouter } from "next/navigation";
import { InsufficientCreditsModal } from "./InsufficientCredits";

// ✅ Form Schema Validation
export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

export function TransformationForm({
  action,
  userId,
  type,
  creditBalance,
  data = null,
  config = null,
}: TransformationFormProps) {
  const router = useRouter();
  const transformationType = transformationTypes[type];
  const [Image, setImage] = useState(data);
  const [newTransformation, setnewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);

  const [isPending, startTransition] = useTransition();

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // ✅ Handle form submission
 async function onSubmit(values: z.infer<typeof formSchema>) {
    setisSubmitting(true);
    if( data || Image){
      const transformationUrl=getCldImageUrl({
        width: Image?.width,
        height: Image?.height,
        src: Image?.publicId,
        ...transformationConfig
      })

      const imageData={
        title:values.title,
        publicId: Image?.publicId,
        transformationType: type,
        width: Image?.width,
        height: Image?.height,
        config: transformationConfig,
        secureURL:Image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color
      }
      if(action === 'Add'){
        try{
          const newImage =await addImage({
            image: imageData,
            userId,
            path: "/" 
          })
          if(newImage){
            form.reset();
            setImage(data);
            router.push(`/transformations/${newImage._id}` );
        }
      }catch(e){
          console.error("Error adding image:", e);
        }
    }

    if(action === 'Update'){
        try{
          const updatedImage =await updateImage({
            image:{
              ...imageData,
              _id: data?._id
            },
            userId,
            path: `/transformations/${data?._id}`
          })
          if(updatedImage){
            router.push(`/transformations/${updatedImage._id}` );
        }
      }catch(e){
          console.error("Error adding image:", e);
        }
    }

      setisSubmitting(false);
    }
  }

  // ✅ Aspect Ratio selection
  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prevState: typeof data) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));
    setnewTransformation(transformationType.config);
    return onChangeField(value);
  };

  // ✅ Input changes for dynamic updates
const onInputChangeHandler = (
  fieldName: string,
  value: string,
  type: string,
  onChangeField: (value: string) => void
) => {
  setnewTransformation((prevState: any) => ({
    [type]: {
      ...prevState?.[type],
      [fieldName === "prompt" ? "prompt" : "to"]: value,
    },
  }));
  onChangeField(value);
};

  // ✅ Apply transformation
  const onTransformHandler = async () => {
    setTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation ?? {}, transformationConfig)
    );
    setnewTransformation(null);
    startTransition(async () => {
       await updateCredits(userId, creditFee);
    });
  };
useEffect(()=>{
    console.log("Image:", Image, "type:", type, "config:", transformationType.config);
  if(Image && (type==='restore' || type==='removeBackground')){
    setnewTransformation(transformationType.config)
  }
},[Image,transformationType.config,type])
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-[#181818] p-6 rounded-xl shadow-lg shadow-black/40 border border-gray-700"
      >
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal></InsufficientCreditsModal>}
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {action === "Update" ? "Update Image" : "Create Transformation"}
          </h2>
          <p className="text-gray-400 text-sm">
            Configure your image transformation details below.
          </p>
        </div>

        {/* Image Title */}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter image title"
              className="bg-[#222] text-white placeholder-gray-500 border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-md"
            />
          )}
        />

        {/* Aspect Ratio Selector */}
        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
              >
                <SelectTrigger className="w-full bg-[#222] text-white border-gray-700 focus:ring-2 focus:ring-red-500 rounded-md">
                  <SelectValue placeholder="Select Aspect Ratio" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c1c1c] text-white border border-gray-700">
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="hover:bg-red-600 hover:text-white cursor-pointer"
                    >
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {/* Prompt for Remove / Recolor */}
        {(type === "remove" || type === "recolor") && (
          <CustomField
            control={form.control}
            name="prompt"
            formLabel={
              type === "remove" ? "Object to remove" : "Object to recolor"
            }
            className="w-full"
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={(e) =>
                  onInputChangeHandler(
                    "prompt",
                    e.target.value,
                    type,
                    field.onChange
                  )
                }
                placeholder={
                  type === "remove"
                    ? "Enter object to remove"
                    : "Enter object to recolor"
                }
                className="bg-[#222] text-white placeholder-gray-500 border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-md"
              />
            )}
          />
        )}

        {/* Replacement Color */}
        {type === "recolor" && (
          <CustomField
            control={form.control}
            name="color"
            formLabel="Replacement Color"
            className="w-full"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter replacement color"
                className="bg-[#222] text-white placeholder-gray-500 border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-md"
              />
            )}
          />
        )}

        <div className="flex flex-row gap-4">
          <CustomField
            control={form.control}
            name="publicId"
            className="size-full flex flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value ?? ""}
                image={Image}
                type={type}
              />
            )}
          />
           <TransformedImage
           image={Image}
           type={type}
           title={form.getValues().title}
           isTransforming={transforming}
           setIsTransforming={setTransforming}
           transformationConfig={transformationConfig}
           ></TransformedImage>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            onClick={onTransformHandler}
            disabled={transforming || newTransformation === null}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 shadow-md shadow-red-700/30"
          >
            {transforming ? "Transforming..." : "Apply Transformation"}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105"
          >
            {isSubmitting ? "Submitting..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default TransformationForm;
