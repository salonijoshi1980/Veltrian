import { Lock, LockOpen, File as FileIcon } from "lucide-react";

export default function FileList({
  files,
  onPreview,
  onExport,
  onDelete,
  isLoading,
  formatFileSize,
  formatDate,
}) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-slate-900">No files</h3>
        <p className="mt-1 text-sm text-slate-700">
          Get started by uploading a new file.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
      <ul className="divide-y divide-slate-100">
        {files.map((file) => (
          <li key={file.id}>
            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                  <FileIcon className="h-6 w-6 text-slate-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-slate-900 flex items-center">
                    {file.name}
                    {file.encrypted ? (
                      <Lock
                        className="ml-2 h-4 w-4 text-green-600"
                        title="Encrypted"
                      />
                    ) : (
                      <LockOpen
                        className="ml-2 h-4 w-4 text-red-600"
                        title="Not Encrypted"
                      />
                    )}
                  </div>
                  <div className="flex space-x-4 text-sm text-slate-600">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{file.mimeType || "Unknown"}</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPreview(file)}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-50"
                >
                  Preview
                </button>
                <button
                  onClick={() => onExport(file)}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-50"
                >
                  Export
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1 border border-slate-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
