"use client";

import { FaSync } from "react-icons/fa";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-row w-full justify-center items-center ${className}`}>
      <FaSync className="animate-spin" />
      <span className="ml-4">Loading...</span>
    </div>
  );
}
