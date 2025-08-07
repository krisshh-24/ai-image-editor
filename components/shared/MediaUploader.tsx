"use client";

import { toast } from "sonner";
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));

    toast("Image uploaded successfully! 1 credit will be deducted from your profile");
    onValueChange(result?.info?.public_id);
  };

  const onUploadErrorHandler = () => {
    console.error("Image upload failed. Please try again.");
    toast("Could not upload image...");
  };

  return (
    <CldUploadWidget
      uploadPreset="ks-smartcutai"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => {
        const handleClick = () => {
          if (open) open(); // ensure open exists before calling
        };

        return (
          <div className="flex flex-col gap-4 p-6 bg-[#181818] rounded-xl border border-gray-700 shadow-md shadow-black/40">
            <h3 className="text-lg font-semibold text-white">Original Image</h3>

            {publicId ? (
              <div
                className="cursor-pointer overflow-hidden rounded-xl border border-gray-700 shadow-lg hover:scale-[1.02] transition-transform"
                onClick={handleClick}
              >
                <CldImage
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="Uploaded Image"
                  sizes="(max-width: 767px) 100vw, 50vw"
                  placeholder={dataUrl as PlaceholderValue}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                onClick={handleClick}
                className="flex flex-col items-center justify-center gap-3 w-full py-8 bg-[#1E1E1E] border border-gray-700 rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 transition">
                  <Image
                    src="/assets/icons/add.svg"
                    alt="Add Image"
                    width={28}
                    height={28}
                    className="invert"
                  />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  Click here to upload an image
                </p>
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default MediaUploader;
