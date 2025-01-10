'use client';

import { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineCompass,
  AiOutlineStar,
  AiOutlineBook,
  AiOutlineCrown,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
} from 'react-icons/ai';
import { RxDotsHorizontal } from 'react-icons/rx';
import { RiQuillPenLine } from 'react-icons/ri';
import NextLink from 'next/link';
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
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import { logout } from '@/src/services/AuthService';
import { useUser } from '@/src/context/user.provider';

import { Logo } from './icons';
import WritePost from '../feed/WritePost';

const SideNavbar: React.FC = () => {
  const { user, setIsLoading: userLoading } = useUser();
  const profileId = user?._id;
  const avatarUrl =
    user?.displayPicture || 'https://i.ibb.co.com/wcv1QBQ/5951752.png';
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // console.log(user);

  const menuItems = [
    { name: 'Home', icon: AiOutlineHome, href: '/' },
    { name: 'Explore', icon: AiOutlineCompass, href: '/explore' },
    { name: 'Premiums', icon: AiOutlineStar, href: '/premium-recipes' },
    { name: 'Bookmarks', icon: AiOutlineBook, href: '/bookmarks' },
    { name: 'Follow Users', icon: AiOutlineUsergroupAdd, href: '/follow' },
    { name: 'Premium Plan', icon: AiOutlineCrown, href: '/premium-plan' },
    { name: 'Profile', icon: AiOutlineUser, href: `/profile/${profileId}` },
    { name: 'Settings', icon: AiOutlineSetting, href: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      userLoading(true);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      userLoading(false);
    }
  };

  return (
    <div
      className="fixed h-full"
      style={{
        zIndex: 50,
      }}
    >
      {/* Desktop Navbar */}
      <div className="hidden lg:flex flex-col h-full w-64 border-r border-gray-300">
        <div className="flex flex-col items-start p-4 space-y-4 mb-3">
          <NextLink href="/" className="flex items-center gap-2">
            <Logo />
            <p className="font-bold text-inherit text-xl">Cheffy</p>
          </NextLink>
        </div>
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
        <Button radius="full" onPress={onOpen} className="w-3/4 ml-3 my-6">
          Post
        </Button>

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

      {/* Tablet Navbar */}
      <div className="hidden md:flex lg:hidden flex-col h-full w-16 border-r border-gray-300 mb-3">
        <div className="flex flex-col items-start p-4 space-y-4">
          <NextLink href="/" className="flex items-center gap-2">
            <Logo />
          </NextLink>
        </div>
        <nav className="flex flex-col items-center p-4 space-y-6">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-800 hover:text-blue-500"
            >
              <item.icon size={24} />
            </a>
          ))}
        </nav>
        <Button isIconOnly onPress={onOpen} radius="full" className="ml-3 my-6">
          <RiQuillPenLine />
        </Button>

        <div className="absolute bottom-0 my-4 w-11/12 bg-transparent">
          <Dropdown>
            <DropdownTrigger>
              <Button className="flex flex-row items-center justify-between w-full px-3 py-6 rounded-full bg-transparent hover:bg-gray-200">
                <Avatar size="sm" src={avatarUrl} />
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

      {/* Mobile Navbar */}
      <div className="fixed w-screen bottom-0 md:hidden">
        {/* <button className="p-4" onClick={() => setIsMenuOpen((prev) => !prev)}>
          <FaBars size={24} />
        </button>
        {isMenuOpen && (
          <div className="fixed inset-y-0 left-0 bg-white w-64 shadow-lg z-50">
            <button
              className="absolute top-4 right-4 text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              ✖
            </button>
            <nav className="flex flex-col items-start p-4 space-y-4">
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
          </div>
        )} */}
        <p>Mobile Navbar</p>
      </div>

      <Modal
        backdrop={'blur'}
        isOpen={isOpen}
        scrollBehavior={'outside'}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span>{user?.name}, write a new recipe.</span>
              </ModalHeader>
              <ModalBody>
                {/* <RecipePostForm /> */}
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
  );
};

export default SideNavbar;
