import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";


const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) => {


  return (
    <div className="bg-[#181818] p-6 rounded-xl shadow-md shadow-black/50 border border-gray-800 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Transformed</h3>
      </div>

      {/* Image Preview */}
      {image?.publicId && transformationConfig ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-700">
          <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={image?.publicId}
                alt="Transformed Image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="object-cover w-full h-full"
                onLoad={() => {
                    setIsTransforming && setIsTransforming(false);
                }}
                onError={() => {
                    debounce(()=>{
                        setIsTransforming && setIsTransforming(false);
                        console.error("Image transformation failed.");
                    },8000)
                }}
                {...transformationConfig}
              />
              {isTransforming && (
                <div>
                  <Image
                    src="/assets/icons/spinner.svg"
                    alt="Loading"
                    width={24}
                    height={24}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin"
                  />
                </div>
              )}
          <div className="flex items-center justify-center h-64 bg-[#1e1e1e] text-gray-400">
            <p className="text-sm">[Transformed Image Preview Here]</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-64 bg-[#1f1f1f] border border-gray-700 rounded-lg">
          <p className="text-gray-500 text-sm">No transformed image yet</p>
        </div>
      )}

    </div>
  );
};

export default TransformedImage;
