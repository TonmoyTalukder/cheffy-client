'use client';

import { useGetAllUsers } from '@/src/hooks/user.hooks';
import { IUser } from '@/src/types';
import { Input } from '@nextui-org/input';
import { Avatar } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImSearch } from 'react-icons/im';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

  const { data: usersFetchedData } = useGetAllUsers();
  const usersData = usersFetchedData?.data || [];
  const avatarUrl = 'https://i.ibb.co.com/wcv1QBQ/5951752.png';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase();

    setSearchTerm(searchText);

    if (searchText.length > 0) {
      const filtered = usersData.filter(
        (user: IUser) =>
          user.name.toLowerCase().includes(searchText) ||
          user.email.toLowerCase().includes(searchText),
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
      setSearchTerm('');
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    const formattedSearchTerm = searchTerm.trim().replace(/\s+/g, '+');

    router.push(`/explore?searchText=${formattedSearchTerm}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full">
      <Input
        classNames={{
          base: 'w-full h-10',
          inputWrapper: 'h-full bg-default-400/20 dark:bg-default-500/20',
          input: 'text-small',
        }}
        style={{
          marginRight: '3rem',
        }}
        placeholder="Type to search..."
        size="md"
        startContent={<ImSearch size={18} />}
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchClick(); 
          }
        }}
        onClick={(e) => e.stopPropagation()}
        aria-label="Search"
      />

      {showSuggestions && (
        <div
          className="absolute bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg w-full max-w-xl mt-2 px-4 py-3"
          style={{
            top: '52px',
            // left: '50%',
            transform: 'translateX(-3%)',
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
                    if (e.key === 'Enter' || e.key === ' ') {
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
              if (e.key === 'Enter' || e.key === ' ') {
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

export default SearchBar;
