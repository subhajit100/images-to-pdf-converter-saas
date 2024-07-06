"use client";

import React, { createContext, useState, useContext } from "react";

interface FileContextProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const FileContext = createContext<FileContextProps | undefined>(undefined);

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileContext.Provider value={{ files, setFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
      throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
  };
