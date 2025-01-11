"use client";

import {
  AiOutlineHome,
  AiOutlineCompass,
  AiOutlineStar,
  AiOutlineUser,
} from "react-icons/ai";
import { useRouter, usePathname } from "next/navigation";
import { Tooltip } from "@nextui-org/react";

import { useUser } from "@/src/context/user.provider";

const MobileNavbar = () => {
  const { user } = useUser();
  const profileId = user?._id;
  const router = useRouter();
  const currentPath = usePathname();

  const menuItems = [
    { name: "Home", icon: AiOutlineHome, href: "/" },
    { name: "Explore", icon: AiOutlineCompass, href: "/explore" },
    { name: "Premiums", icon: AiOutlineStar, href: "/premium-recipes" },
    { name: "Profile", icon: AiOutlineUser, href: `/profile/${profileId}` },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="flex justify-between items-center px-4 py-2">
        {menuItems.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <Tooltip
              key={item.name}
              content={item.name}
              placement="top"
              color="primary"
            >
              <div
                role="button"
                onClick={() => handleNavigation(item.href)}
                className={`flex flex-col items-center cursor-pointer transition ${
                  isActive ? "text-blue-500" : "text-gray-500"
                } hover:text-blue-400`}
              >
                <item.icon size={24} className="mb-1" />
                <span
                  className={`text-sm font-medium ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
