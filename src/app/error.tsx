"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center max-h-screen p-6">
      <h2 className="text-3xl font-semibold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-lg text-slate-500 mb-6 text-center">
        We encountered an error while processing your request. Please try again.
      </p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        onClick={reset}
      >
        Try Again
      </button>
    </div>
  );
}
