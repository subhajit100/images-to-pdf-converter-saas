import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ImagePreviewProps {
  file: File;
}

interface ImageDimensionProps {
  width: number;
  height: number;
}

const ImagePreview = ({ file }: ImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      //   console.log("previewurl", reader.result);
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);
  return (
    <div className="flex flex-col items-center m-2">
      {previewUrl ? (
          <Image
            src={previewUrl}
            alt={file.name}
            width={100}
            height={100}
            className="object-cover"
          />
      ) : (
        <div className="w-24 h-24 bg-gray-200 animate-pulse" />
      )}
      <p className="text-sm mt-2">{file.name}</p>
    </div>
  );
};

export default ImagePreview;
