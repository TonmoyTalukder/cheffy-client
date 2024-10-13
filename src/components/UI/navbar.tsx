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
import { Avatar } from "@nextui-org/react";
import { AiOutlineLogout } from "react-icons/ai";

import { siteConfig } from "@/src/config/site";
import { Logo } from "@/src/components/UI/icons";
import { ThemeSwitch } from "@/src/components/UI/theme-switch";
import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";
import { useGetSingleUser } from "@/src/hooks/user.hooks";

export const Navbar = () => {
  const pathname = usePathname();

  const router = useRouter();
  const { user, setIsLoading: userLoading } = useUser();
  const profileId = user?._id;
  const { data } = useGetSingleUser(profileId!);

  console.log("profileId => ", user?._id);

  const avatarUrl =
    data?.data?.displayPicture || "https://i.ibb.co.com/wcv1QBQ/5951752.png";

  const handleLogout = async () => {
    try {
      // Call the logout function to clear the session on the server
      await logout();

      // Set loading state to true while logging out
      userLoading(true);

      // Optionally reset the user context here (if applicable)
      // e.g., setUser(null);

      // Redirect to the login page
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      // Stop the loading state once logout is complete
      userLoading(false);
    }
    // if (protectedRoutes.some((route) => pathname.match(route))) {
    //   router.push("/login");
    // }
  };

  const navMenuItems = siteConfig.navMenuItems.map((item) => {
    if (item.label === "Profile") {
      // Inject dynamic href for Profile link
      return {
        ...item,
        href: profileId ? `/profile/${profileId}` : "/login",
      };
    }

    return item;
  });

  return (
    <NextUINavbar isBordered maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Cheffy</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        <ul className="hidden lg:flex gap-10 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  pathname === item.href
                    ? "text-indigo-500 font-medium"
                    : "data-[active=true]:text-indigo-500 data-[active=true]:font-medium",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
          <Link href={`/profile/${profileId}`}>
            <Avatar size="sm" src={avatarUrl} />
          </Link>
        </NavbarItem>
        <NavbarItem
          key="logout"
          className="text-danger"
          onClick={() => handleLogout()}
        >
          <AiOutlineLogout size={25} />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className={clsx(
                  linkStyles({
                    color: "foreground",
                  }),
                  pathname === item.href
                    ? "text-indigo-500 font-medium"
                    : "data-[active=true]:text-indigo-500 data-[active=true]:font-medium",
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
              key="delete"
              className="text-danger"
              onClick={() => handleLogout()}
            >
              <AiOutlineLogout size={25} />
            </NavbarItem>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
