'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MenuItem, Button } from '@nextui-org/react';
import { CgClose } from 'react-icons/cg';

import { useUser } from '@/src/context/user.provider';
import { useGetSingleUser } from '@/src/hooks/user.hooks';
import { logout } from '@/src/services/AuthService';
import Loading from '../loading';

const Sidebar = ({
  toggleDrawer,
  screenWidth,
}: {
  toggleDrawer?: () => void;
  screenWidth: number;
}) => {
  const router = useRouter();
  const { user: searchingUser, setIsLoading: userLoading } = useUser();
  const { data: loggedUserData } = useGetSingleUser(searchingUser?._id!);
  const loggedUser = loggedUserData?.data;

  console.log('Looged User: ', loggedUser);

  const navigateTo = (path: string) => {
    router.push(path);
    if (toggleDrawer) {
      toggleDrawer(); // Close the drawer after navigation
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout function to clear the session on the server
      await logout();

      // Set loading state to true while logging out
      userLoading(true);

      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // Stop the loading state once logout is complete
      userLoading(false);
    }
  };

  if (loggedUser === undefined || null) {
    return (
      <div className="w-[100vw] z-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
      {/* Show close button only on small screens */}
      {screenWidth < 1024 && toggleDrawer && (
        <Button
          className="absolute top-4 right-4"
          isIconOnly
          onClick={toggleDrawer}
        >
          <CgClose className="h-6 w-6" />
        </Button>
      )}
      <Menu className="flex flex-col mt-8">
        <MenuItem onClick={() => navigateTo('/admin-dashboard')}>
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => navigateTo('/admin-user')}>User</MenuItem>
        <MenuItem onClick={() => navigateTo('/admin-recipe')}>Recipe</MenuItem>
        <MenuItem onClick={() => navigateTo(`/profile/${loggedUser._id}`)}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleLogout()} className="text-red-600">
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Sidebar;
