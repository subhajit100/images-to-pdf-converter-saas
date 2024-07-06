import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <Button
          className="absolute top-2 right-2 text-black bg-slate-300 text-xl"
          onClick={onClose}
          variant='destructive'
          size='sm'
        >
          &times;
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
