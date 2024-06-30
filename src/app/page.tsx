import UploadInput from "@/components/upload/uploadInput";

export default function Home() {
    
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold">Convert Image to Pdf</h1>
        <UploadInput />
    </div>
  );
}
