export default function PreviewModal({
  previewFile,
  previewUrl,
  isLoading,
  onClose,
  onDownload,
}) {
  if (!previewFile) return null;

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (
      previewFile.mimeType?.startsWith("text/") ||
      previewFile.mimeType === "application/json"
    ) {
      return (
        <iframe
          src={previewUrl}
          className="flex-1 w-full border rounded border-slate-200"
          title={`Preview of ${previewFile.name}`}
          onError={(e) => {
            console.error("Preview failed for text file:", e);
            e.target.style.display = "none";
          }}
        />
      );
    }

    if (previewFile.mimeType === "application/pdf") {
      return (
        <embed
          src={previewUrl}
          type="application/pdf"
          className="flex-1 w-full"
          onError={(e) => {
            console.error("Preview failed for PDF:", e);
            e.target.style.display = "none";
          }}
        />
      );
    }

    if (previewFile.mimeType?.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt={`Preview of ${previewFile.name}`}
          className="max-w-full max-h-full mx-auto"
          onError={(e) => {
            console.error("Preview failed for image:", e);
            e.target.style.display = "none";
          }}
        />
      );
    }

    if (previewFile.mimeType?.startsWith("video/")) {
      return (
        <video
          src={previewUrl}
          controls
          className="max-w-full max-h-full mx-auto"
          onError={(e) => {
            console.error("Preview failed for video:", e);
            e.target.style.display = "none";
          }}
        />
      );
    }

    if (previewFile.mimeType?.startsWith("audio/")) {
      return (
        <audio
          src={previewUrl}
          controls
          className="w-full mt-8"
          onError={(e) => {
            console.error("Preview failed for audio:", e);
            e.target.style.display = "none";
          }}
        />
      );
    }

    // Default fallback for unsupported types
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <svg
          className="mx-auto h-12 w-12 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-900">
          Preview not available
        </h3>
        <p className="mt-1 text-sm text-slate-700">
          This file type cannot be previewed directly.
        </p>
        <div className="mt-6">
          <a
            href={previewUrl}
            download={previewFile.name}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg"
          >
            Download File
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-300">
        <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-medium text-slate-900">
            Preview: {previewFile.name}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="h-full flex flex-col">{renderPreviewContent()}</div>
        </div>
      </div>
    </div>
  );
}
