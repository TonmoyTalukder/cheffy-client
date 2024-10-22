export type SiteConfig = typeof siteConfig;
import { GoHomeFill } from "react-icons/go";
import { PiListStarFill } from "react-icons/pi";
import { FaUserFriends } from "react-icons/fa";

export const siteConfig = {
  name: "Cheffy",
  description:
    "A vibrant recipe-sharing community where culinary enthusiasts connect, share recipes of their favorite dishes, and inspire each other with delicious creations!",
  navItems: [
    {
      label: <GoHomeFill style={{ fontSize: "30", marginTop: "4" }} />,
      href: "/",
    },
    {
      label: <PiListStarFill style={{ fontSize: "30", marginTop: "4" }} />,
      href: "/premium-recipes",
    },
    {
      label: <FaUserFriends style={{ fontSize: "30", marginTop: "4" }} />,
      href: "/follow",
    },
  ],
  navMenuItems: [
    {
      label: <GoHomeFill style={{ fontSize: "30", marginTop: "4" }} />,
      href: "/",
    },
    {
      label: <PiListStarFill style={{ fontSize: "30", marginTop: "4" }} />,
      href: "/premium-recipes",
    },
    {
      label: <FaUserFriends style={{ fontSize: "30", marginTop: "4" }} />,
      href: `/follow`,
    },
    {
      label: "Profile",
      href: `/profile`,
    },
    {
      label: "About Us",
      href: `/about-us`,
    },
    {
      label: "Contact Us",
      href: `/contact-us`,
    },
    // {
    //   label: "Logout",
    //   href: "/logout",
    // },
  ],
};
