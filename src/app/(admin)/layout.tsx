"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { CgMenuLeft } from "react-icons/cg";

import Sidebar from "./Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar for large screens */}
      {windowWidth >= 1024 ? (
        <>
          <div className="h-screen w-2/12">
            <Sidebar screenWidth={windowWidth} /> {/* Pass screenWidth */}
          </div>
          {/* Main content area */}
          <div className="flex-1 px-6 pt-12 mt-2  min-h-screen overflow-y-auto">
            {children}
          </div>
        </>
      ) : (
        // Menu button for smaller screens
        <div>
          {!isDrawerOpen ? (
            <div className="w-screen">
              <div className="">
                <Button
                  className="fixed top-4 mx-2"
                  isIconOnly
                  onClick={toggleDrawer}
                >
                  <CgMenuLeft className="h-6 w-6" />
                </Button>
              </div>
              <div className="">
                <div className="flex-1 min-h-screen overflow-y-auto p-6 pt-12 mt-2">
                  {children}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="fixed z-10 h-screen w-7/12">
                <Sidebar
                  toggleDrawer={toggleDrawer} // Pass the toggleDrawer function
                  screenWidth={windowWidth} // Pass screenWidth
                />
              </div>
              <div className="flex-1 min-h-screen overflow-y-auto px-6 pt-12 mt-2">
                {children}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
