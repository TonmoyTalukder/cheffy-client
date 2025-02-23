// navbar.tsx
/* eslint-disable no-console */
"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Input } from "@nextui-org/react";
import { AiOutlineLogout } from "react-icons/ai";
import { ImSearch } from "react-icons/im";
import { useState, useEffect } from "react";

import { siteConfig } from "@/src/config/site";
import { Logo } from "@/src/components/UI/icons";
import { ThemeSwitch } from "@/src/components/UI/theme-switch";
import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";
import { useGetAllUsers, useGetSingleUser } from "@/src/hooks/user.hooks";
import { IUser } from "@/src/types";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setIsLoading: userLoading } = useUser();
  const profileId = user?._id;
  const { data } = useGetSingleUser(profileId!);
  const { data: usersFetchedData } = useGetAllUsers();
  const usersData = usersFetchedData?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const avatarUrl =
    data?.data?.displayPicture || "https://i.ibb.co.com/wcv1QBQ/5951752.png";

  const handleLogout = async () => {
    try {
      await logout();
      userLoading(true);
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      userLoading(false);
    }
  };

  const navMenuItems = siteConfig.navMenuItems.map((item) => {
    if (item.label === "Profile") {
      return {
        ...item,
        href: profileId ? `/profile/${profileId}` : "/login",
      };
    }

    return item;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    setSearchTerm(searchTerm);

    if (searchTerm.length > 0) {
      const filtered = usersData.filter(
        (user: IUser) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm),
      );

      setFilteredUsers(filtered.slice(0, 3)); // Limit to top 3 users
      setShowSuggestions(true);
    } else {
      setFilteredUsers([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
      setSearchTerm("");
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    const formattedSearchTerm = searchTerm.trim().replace(/\s+/g, "+");

    router.push(`/search?searchText=${formattedSearchTerm}`);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <div>
      <NextUINavbar
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          borderBottom: "1px solid var(--nextui-colors-border)",
          backgroundColor: "var(--nextui-colors-background)",
        }}
        isBordered
        maxWidth="xl"
      >
        <NavbarContent className="flex flex-row" justify="start">
          <NavbarBrand className="flex items-left gap-0">
            <NextLink href="/" className="flex items-center gap-2">
              <Logo />
              <p className="font-bold text-inherit">Cheffy</p>
            </NextLink>
          </NavbarBrand>
          <Input
            classNames={{
              base: "w-auto h-10",
              inputWrapper: "h-full bg-default-400/20 dark:bg-default-500/20",
              input: "text-small",
            }}
            style={{
              marginRight: "3rem",
            }}
            placeholder="Type to search..."
            size="md"
            startContent={<ImSearch size={18} />}
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
            aria-label="Search"
          />
        </NavbarContent>

        {user?.role === "USER" && (
          <NavbarContent
            className="hidden xl:flex lg:flex md:flex flex-1 justify-center"
            justify="center"
          >
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    pathname === item.href
                      ? "text-indigo-500 font-medium"
                      : "hover:text-indigo-500",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </NavbarContent>
        )}

        <NavbarContent className="flex-1 justify-end" justify="end">
          <NavbarItem className="hidden sm:flex gap-2">
            <ThemeSwitch />
            <Link href={`/profile/${profileId}`}>
              <Avatar size="sm" src={avatarUrl} />
            </Link>
          </NavbarItem>
          <NavbarItem
            key="logout"
            className="text-danger cursor-pointer"
            onClick={handleLogout}
          >
            <AiOutlineLogout size={25} />
          </NavbarItem>
          <NavbarMenuToggle className="sm:hidden md:hidden" />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    pathname === item.href
                      ? "text-indigo-500 font-medium"
                      : "hover:text-indigo-500",
                  )}
                  href={`${item.href}`}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
            <NavbarMenuItem key="logout">
              <NavbarItem
                key="logout"
                className="text-danger cursor-pointer"
                onClick={handleLogout}
              >
                <AiOutlineLogout size={25} />
              </NavbarItem>
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </NextUINavbar>

      {showSuggestions && (
        <div
          className="absolute bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg w-full max-w-xl mt-2 px-4 py-3"
          style={{
            top: "72px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
          }}
        >
          {filteredUsers.length > 0 && (
            <>
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleUserClick(user._id!)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleUserClick(user._id!);
                    }
                  }}
                >
                  <Avatar src={user.displayPicture || avatarUrl} size="sm" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {user.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
          <div
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={handleSearchClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleSearchClick();
              }
            }}
          >
            <ImSearch size={18} />
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Search for &quot;{searchTerm}&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
