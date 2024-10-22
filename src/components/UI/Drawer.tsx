import { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Drawer = ({ open, onClose, children }: DrawerProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 transform transition-transform ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ transition: "transform 0.3s ease" }}
    >
      {/* Overlay */}
      <div
        role="button"
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative bg-white dark:bg-gray-800 h-full w-80 p-4 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black dark:text-white"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};
