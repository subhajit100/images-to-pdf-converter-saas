import React, { useRef, useState } from "react";
import ImagePreview from "./ImagePreview";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import jsPDF from "jspdf";

interface convertToPdfProps {
  files: File[];
}

const ConvertToPdf = ({ files }: convertToPdfProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const firstPdfFileName = useRef<string>("");

  const handleConvertToPdf = async () => {
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const padding = 10; // Padding from the edges

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (i == 0) {
        firstPdfFileName.current = file.name.split(".")[0];
      }
      const imgData = await readFileAsDataURL(file);
      const img = new window.Image();
      img.src = imgData;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;
          const aspectRatio = imgWidth / imgHeight;

          let finalWidth = width - 2 * padding;
          let finalHeight = finalWidth / aspectRatio;

          if (finalHeight > height - 2 * padding) {
            finalHeight = height - 2 * padding;
            finalWidth = finalHeight * aspectRatio;
          }

          const x = (width - finalWidth) / 2;
          const y = (height - finalHeight) / 2;

          pdf.addImage(img, "JPEG", x, y, finalWidth, finalHeight);
          if (i < files.length - 1) {
            pdf.addPage();
          }
          resolve();
        };
      });
    }

    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  return (
    <div className="mt-4">
      <div className="flex flex-wrap mt-4">
        {files.map((file, index) => (
          <ImagePreview key={file.name + index} file={file} />
        ))}
      </div>
      <div className="flex flex-col my-5 gap-y-4 justify-center items-center">
        <Button
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          onClick={handleConvertToPdf}
        >
          Convert to PDF{" "}
          <span className="mx-2">
            <FaArrowRight size={20} color="white" />
          </span>
        </Button>
        {pdfUrl && (
          <a
            href={pdfUrl}
            download={`${firstPdfFileName.current}_merged.pdf`}
            className="block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Download PDF
          </a>
        )}
      </div>
    </div>
  );
};

export default ConvertToPdf;
