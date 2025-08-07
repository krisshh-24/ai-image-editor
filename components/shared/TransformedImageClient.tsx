"use client";

import TransformedImage from "./TransformedImage";

export default function TransformedImageClient({ image }: { image: any }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.secure_url; // assuming `secure_url` contains the image URL
    link.download = `${image.title || "image"}.jpg`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TransformedImage
        image={image}
        type={image.transformationType}
        title={image.title}
        isTransforming={false}
        transformationConfig={image.config}
        hasDownload={true}
      />

      <button
        onClick={handleDownload}
        className="mt-2 rounded-md bg-red-600 px-5 py-2 text-white text-sm font-medium shadow hover:bg-red-700 transition-colors"
      >
        Download Image
      </button>
    </div>
  );
}
