import { useRef } from "react";

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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="mb-8 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-500 transition relative bg-white"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          className="mx-auto h-12 w-12 text-slate-500"
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
        <h3 className="mt-2 text-lg font-medium text-slate-900">
          Upload Files
        </h3>
        <p className="mt-1 text-sm text-slate-700">
          Drag and drop files here or click to select
        </p>

        <button
          type="button"
          onClick={handleFileSelect}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Choose Files
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => onFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Drag overlay */}
      <div
        ref={dragOverlay}
        className="absolute inset-0 bg-slate-500/10 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center hidden"
      >
        <div className="text-slate-700 font-medium">Drop files here</div>
      </div>
    </div>
  );
}
