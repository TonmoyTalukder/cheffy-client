"use client";

import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

import MenuDrawer from "./MenuDrawer";

const TopMenu = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <button className="p-2 bg-transparent" onClick={handleDrawerToggle}>
        <AiOutlineMenu size={24} className="text-gray-700" />
      </button>
      {isDrawerOpen && (
        <MenuDrawer isOpen={isDrawerOpen} onClose={handleDrawerToggle} />
      )}
    </div>
  );
};

export default TopMenu;
