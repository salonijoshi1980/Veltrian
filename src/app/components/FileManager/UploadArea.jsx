import { useRef } from "react";
import { useAuth } from "@/utils/clerkAuth";
import { SignInButton } from "@clerk/clerk-react";

export default function UploadArea({
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  isUploading,
  uploadProgress,
  fileInputRef,
}) {
  const dragOverlay = useRef(null);
  const { isAuthenticated } = useAuth();

  const handleFileSelect = () => {
    if (!isAuthenticated) {
      // You can show a message or trigger login modal here
      alert("Please login to upload files");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = (files) => {
    if (!isAuthenticated) {
      alert("Please login to upload files");
      return;
    }
    onFileUpload(files);
  };

  const handleDrop = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert("Please login to upload files");
      return;
    }
    onDrop(e);
  };

  return (
    <div
      className="mb-8 border-2 border-dashed border-amber-300 rounded-lg p-8 text-center hover:border-amber-500 transition relative bg-white"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          className="mx-auto h-12 w-12 text-amber-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-amber-900">
          Upload Files
        </h3>
        <p className="mt-1 text-sm text-amber-700">
          Drag and drop files here or click to select
        </p>
        
        {!isAuthenticated ? (
          <div className="mt-4">
            <p className="text-sm text-amber-600 mb-2">Please login to upload files</p>
            <SignInButton mode="modal">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-900 bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                Login to Upload
              </button>
            </SignInButton>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleFileSelect}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-900 bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Choose Files
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Drag overlay */}
      <div
        ref={dragOverlay}
        className="absolute inset-0 bg-amber-500/10 border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center hidden"
      >
        <div className="text-amber-700 font-medium">Drop files here</div>
      </div>

      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-amber-700 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}