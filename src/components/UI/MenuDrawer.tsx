"use client";

import { Logo } from "./icons";

import {
  AiOutlineHome,
  AiOutlineCompass,
  AiOutlineStar,
  AiOutlineCrown,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { RxDotsHorizontal } from "react-icons/rx";

import { logout } from "@/src/services/AuthService";
import { useUser } from "@/src/context/user.provider";

import WritePost from "../feed/WritePost";

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  const { user, setIsLoading: userLoading } = useUser();
  const profileId = user?._id;
  const avatarUrl =
    user?.displayPicture || "https://i.ibb.co.com/wcv1QBQ/5951752.png";

  const { isOpen: isModelOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

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

  const menuItems = [
    { name: "Home", icon: AiOutlineHome, href: "/" },
    { name: "Explore", icon: AiOutlineCompass, href: "/explore" },
    { name: "Premiums", icon: AiOutlineStar, href: "/premium-recipes" },
    { name: "Follow Users", icon: AiOutlineUsergroupAdd, href: "/follow" },
    { name: "Premium Plan", icon: AiOutlineCrown, href: "/premium-plan" },
    { name: "Profile", icon: AiOutlineUser, href: `/profile/${profileId}` },
    { name: "Settings", icon: AiOutlineSetting, href: "/settings" },
  ];

  const adminMenuItems = [
    { name: "Explore", icon: AiOutlineCompass, href: "/explore" },
    { name: "Dashboard", icon: AiOutlineCrown, href: "/admin-dashboard" },
    {
      name: "Profile",
      icon: AiOutlineUser,
      href: `/profile/${profileId}`,
    },
    { name: "Settings", icon: AiOutlineSetting, href: "/settings" },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={onClose} // Close drawer on backdrop click
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-red-600"
          onClick={onClose}
        >
          Close
        </button>
        <div className="p-4">
          <div className="flex flex-col h-full w-64 border-r border-gray-300">
            <div className="flex flex-col items-start p-4 space-y-4 mb-3">
              <NextLink href="/" className="flex items-center gap-2">
                <Logo />
                <p className="font-bold text-inherit text-xl">Cheffy</p>
              </NextLink>
            </div>
            {user && user?.role === "USER" && (
              <>
                <nav className="flex flex-col items-start p-4 space-y-6">
                  {menuItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 text-lg text-gray-800 hover:text-blue-500"
                    >
                      <item.icon size={24} />
                      <span>{item.name}</span>
                    </a>
                  ))}
                </nav>
                <Button
                  radius="full"
                  onPress={onOpen}
                  className="w-3/4 ml-3 my-6"
                >
                  Post
                </Button>
              </>
            )}

            {user && user?.role === "ADMIN" && (
              <>
                <nav className="flex flex-col items-start p-4 space-y-6">
                  {adminMenuItems.map((item) => (
                    <span
                      role="button"
                      onClick={() => navigateTo(item.href)}
                      key={item.name}
                      className="flex items-center space-x-3 text-lg text-gray-800 hover:text-blue-500"
                    >
                      <item.icon size={24} />
                      <span>{item.name}</span>
                    </span>
                  ))}
                </nav>
              </>
            )}

            <div className="absolute bottom-0 my-4 w-11/12 bg-transparent">
              <Dropdown>
                <DropdownTrigger>
                  <Button className="flex flex-row items-center justify-between w-full px-3 py-6 rounded-full bg-transparent hover:bg-gray-200">
                    <Avatar size="sm" src={avatarUrl} />
                    <div className="text-start grow ml-3">{user?.name}</div>
                    <RxDotsHorizontal />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new" onClick={handleLogout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <Modal
            backdrop={"blur"}
            isOpen={isModelOpen}
            scrollBehavior={"outside"}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <span>{user?.name}, write a new recipe.</span>
                  </ModalHeader>
                  <ModalBody>
                    <WritePost />
                  </ModalBody>
                  <ModalFooter className="flex justify-center items-center w-full">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default MenuDrawer;
