"use client";

import React, { useEffect, useRef, useState } from "react";
import ImagePreview from "@/components/upload/ImagePreview";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { useFileContext } from "@/context/FileContext";
import { CiCirclePlus } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { securePdfFormSchema } from "@/schema";
import { z } from "zod";

const ConvertToPdf = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const firstPdfFileName = useRef<string>("");
  const router = useRouter();
  const { files, setFiles } = useFileContext();
  //   const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);

  useEffect(() => {
    if (files.length === 0) {
      router.push("/");
    }
  }, [router, files]);

  const handleAddImageClick = () => {
    console.log("add image clicked");
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = [...files, ...Array.from(selectedFiles)];
      setFiles(fileArray);
      setPdfUrl(null);
    }
  };

  const handleConvertToPdf = async (
    isSecured: boolean,
    values?: z.infer<typeof securePdfFormSchema>
  ) => {
    let pdf: jsPDF = new jsPDF();
    // if (values?.password && isSecured) {
    //   console.log("inside secured");
    //   pdf = new jsPDF({
    //     encryption: {
    //       userPassword: values.password,
    //       ownerPassword: "owner",
    //       userPermissions: [],
    //     },
    //   });
    // } else {
    //   pdf = new jsPDF();
    // }

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

    // simple logic without password protect
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    // setShowPasswordForm(false);
  };

  //   const handleConvertToPdfWithPassword = () => {
  //     setShowPasswordForm(true);
  //   };

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
      <div className="flex flex-wrap gap-x-4 justify-center items-end mt-4">
        {files.map((file, index) => (
          <ImagePreview key={file.name + index} file={file} />
        ))}
        {/* plus icon adding new file */}
        <div
          className="flex justify-center flex-col items-center border border-gray-400 rounded-full px-8 py-10 mx-4 bg-gray-300 cursor-pointer"
          onClick={handleAddImageClick}
        >
          <CiCirclePlus size={24} color="black" />
          <div className="text-xs">Add Images</div>
        </div>
        {/* input field for selecting images */}
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
        />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        {!pdfUrl && (
          <div className="flex justify-center items-center my-4">
            <Button
              className="px-4 py-2 mx-5 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={() => handleConvertToPdf(false)}
            >
              {/* <span className="mx-2">
                <HiLockOpen size={20} color="white" />
              </span> */}
              {/* Convert without password{" "} */}
              Convert{" "}
              <span className="mx-2">
                <FaArrowRight size={20} color="white" />
              </span>
            </Button>
            {/* <Button
              className="px-4 py-2 mx-5 text-white bg-green-500 rounded hover:bg-green-600"
              onClick={handleConvertToPdfWithPassword}
            >
              <span className="mx-2">
                <HiLockClosed size={20} color="white" />
              </span>
              Convert with password{" "}
              <span className="mx-2">
                <FaArrowRight size={20} color="white" />
              </span>
            </Button> */}
            {/* <Modal
              isOpen={showPasswordForm}
              onClose={() => setShowPasswordForm(false)}
            >
              <SecurePdfForm
                onClose={() => setShowPasswordForm(false)}
                handleConvertToPdf={handleConvertToPdf}
              />
            </Modal> */}
          </div>
        )}
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
