'use client';

import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
} from '@nextui-org/react';
import { MdSearch } from 'react-icons/md';
import { AiOutlineSetting } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useGetAllUsers } from '@/src/hooks/user.hooks';
import { IRecipeResponse, IUser } from '@/src/types';
import { useFetchRecipes } from '@/src/hooks/post.hooks';
import RecipeCard from '@/src/components/feed/RecipeCard';

const SearchPage = () => {
  const router = useRouter();
  const { data: usersFetchedData } = useGetAllUsers();
  const usersData = usersFetchedData?.data || [];
  const { data: recipesData } = useFetchRecipes();
  const recipes = recipesData || [];

  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [selectedUserDiets, setSelectedUserDiets] = useState<string[]>([]);
  const [selectedCookingTime, setSelectedCookingTime] = useState<number | ''>(
    '',
  );
  const [selectedRecipeDiets, setSelectedRecipeDiets] = useState<string[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filteredRecipes, setFilteredRecipes] = useState<IRecipeResponse[]>([]);

  console.log('user Data =>', filteredUsers);
  console.log('recipe Data =>', filteredRecipes);

  useEffect(() => {
    if (searchText) {
      const filteredUsers = usersData.filter(
        (user: IUser) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()),
      );

      setFilteredUsers(filteredUsers);

      const filteredRecipes = recipes.filter(
        (recipe: IRecipeResponse) =>
          recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchText.toLowerCase()),
      );

      setFilteredRecipes(filteredRecipes);
    } else {
      const latestUsers = [...usersData]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

      setFilteredUsers(latestUsers);

      const latestRecipes = [...recipes]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

      setFilteredRecipes(latestRecipes);
    }
  }, [searchText, usersData, recipes]);

  useEffect(() => {
    if (selectedUserDiets.length > 0) {
      const filteredUsers: IUser[] = usersData.filter((user: IUser) =>
        selectedUserDiets.includes(user.foodHabit),
      );

      setFilteredUsers(filteredUsers);
    } else {
      const latestUsers = [...usersData]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

      setFilteredUsers(latestUsers);
    }

    if (selectedRecipeDiets.length > 0 || selectedCookingTime) {
      const filteredRecipes = recipes.filter(
        (recipe: IRecipeResponse) =>
          (selectedCookingTime
            ? recipe.cookingTime <= selectedCookingTime
            : true) &&
          (selectedRecipeDiets.length
            ? selectedRecipeDiets.includes(recipe.diet)
            : true),
      );

      setFilteredRecipes(filteredRecipes);
    } else {
      const latestRecipes = [...recipes]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

      setFilteredRecipes(latestRecipes);
    }
  }, [
    selectedUserDiets,
    selectedCookingTime,
    selectedRecipeDiets,
    usersData,
    recipes,
  ]);

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="relative flex flex-col items-center dark:bg-gray-900 min-h-screen">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-md px-4 py-2 flex justify-between items-center">
        <Input
          isClearable
          size="lg"
          placeholder="Search for users or recipes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          startContent={<MdSearch size={20} />}
          className="w-full max-w-xl bg-transparent"
        />
        <Button
          isIconOnly
          size="lg"
          variant="flat"
          className="bg-transparent"
          onPress={onOpen}
        >
          <AiOutlineSetting size={24} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="my-6 px-4 w-full max-w-6xl">
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 mb-4">
          Explore
        </h2>
        {filteredUsers.length > 0 && (
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4 mt-6">
            Users
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <Card
              key={user._id}
              isHoverable
              isPressable
              onPress={() => handleUserClick(user._id!)}
            >
              <Link
                href={`/profile/${user._id}`}
                className="no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <Avatar src={user.displayPicture} size="lg" />
                  <div className="ml-4 text-start">
                    <h1 className="text-gray-800 dark:text-gray-200">
                      {user.name}
                    </h1>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
        {filteredUsers.length > 0 && (
          <div className="text-center mt-4">
            <Button variant="flat" onClick={() => router.push('/follow')}>
              See More
            </Button>
          </div>
        )}
        {filteredRecipes.length > 0 && (
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4 mt-6">
            Recipes
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={`${recipe._id}`}
              recipe={{
                ...recipe,
                authorId: {
                  _id: recipe.authorId._id,
                  name: recipe.authorId.name,
                  displayPicture: recipe.authorId.displayPicture,
                  email: recipe.authorId.email,
                },
                report: recipe.report.toString(),
              }}
            />
          ))}
        </div>
        {filteredRecipes.length > 0 && (
          <div className="text-center mt-4">
            <Button variant="flat" onClick={() => router.push('/')}>
              See More
            </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Filter Options
              </ModalHeader>
              <ModalBody>
                <h3 className="font-semibold mb-2">Filter Users</h3>
                <CheckboxGroup
                  label="Diet"
                  onChange={(values) => setSelectedUserDiets(values)}
                  value={selectedUserDiets}
                >
                  <Checkbox value="vegan">Vegan</Checkbox>
                  <Checkbox value="veg">Vegetarian</Checkbox>
                  <Checkbox value="non-veg">Non-Vegetarian</Checkbox>
                </CheckboxGroup>

                <h3 className="font-semibold mt-4 mb-2">Filter Recipes</h3>
                <Input
                  label="Cooking Time (min)"
                  type="number"
                  value={selectedCookingTime.toString()}
                  onChange={(e) =>
                    setSelectedCookingTime(Number(e.target.value) || '')
                  }
                />
                <CheckboxGroup
                  label="Diet"
                  onChange={(values) => setSelectedRecipeDiets(values)}
                  value={selectedRecipeDiets}
                >
                  <Checkbox value="vegan">Vegan</Checkbox>
                  <Checkbox value="veg">Vegetarian</Checkbox>
                  <Checkbox value="non-veg">Non-Vegetarian</Checkbox>
                </CheckboxGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    console.log('Apply Filters:', {
                      selectedUserDiets,
                      selectedCookingTime,
                      selectedRecipeDiets,
                    });
                    onClose();
                  }}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SearchPage;
