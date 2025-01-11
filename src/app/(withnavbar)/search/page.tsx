"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Card, CardHeader } from "@nextui-org/react";
import { MdFilterList } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";

import { useGetAllUsers } from "@/src/hooks/user.hooks";
import { useFetchRecipes } from "@/src/hooks/post.hooks";
import { Sidebar } from "@/src/components/UI/Sidebar";
import { RecipeInterface } from "@/src/components/post/UserRecipePost";
import { IUser } from "@/src/types";
import RecipeCard from "@/src/components/feed/RecipeCard";
import { Drawer } from "@/src/components/UI/Drawer";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const querySearchText = searchParams.get("searchText");

  const router = useRouter();
  const { data: usersFetchedData } = useGetAllUsers();
  const { data: recipesData } = useFetchRecipes();
  const usersData = usersFetchedData?.data || [];
  const recipes = recipesData || [];

  const [searchText, setSearchText] = useState<string>(querySearchText || "");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedUserDiets, setSelectedUserDiets] = useState<string[]>([]);
  const [selectedCookingTime, setSelectedCookingTime] = useState<number>(0);
  const [selectedRecipeDiets, setSelectedRecipeDiets] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (querySearchText) {
      setSearchText(querySearchText as string);
    }
  }, [querySearchText]);

  const handleUserDietChange = (value: string[]) => {
    setSelectedUserDiets(value);
  };

  const handleRecipeDietChange = (value: string[]) => {
    setSelectedRecipeDiets(value);
  };

  const filteredUsers = usersData
    .filter(
      (user: IUser) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()),
    )
    .filter((user: IUser) => (selectedCity ? user.city === selectedCity : true))
    .filter((user: IUser) =>
      selectedUserDiets.length > 0
        ? selectedUserDiets.includes(user!.foodHabit!)
        : true,
    );

  const filteredRecipes = recipes
    .filter(
      (recipe: RecipeInterface) =>
        recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
        recipe.ingredients.some((ingredient: any) =>
          typeof ingredient === "string"
            ? ingredient.toLowerCase().includes(searchText.toLowerCase())
            : false,
        ) ||
        recipe.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchText.toLowerCase()),
        ),
    )
    .filter((recipe: RecipeInterface) =>
      selectedCookingTime ? recipe.cookingTime <= selectedCookingTime : true,
    )
    .filter((recipe: RecipeInterface) =>
      selectedRecipeDiets.length > 0
        ? selectedRecipeDiets.includes(recipe.diet)
        : true,
    );

  const handleCityFilter = (city: string) => setSelectedCity(city);

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div
      className="flex"
      style={{
        marginTop: "0vh",
      }}
    >
      <aside className="hidden lg:block w-64 p-4 bg-gray-100 dark:bg-gray-800 h-screen">
        <Sidebar
          selectedUserDiets={selectedUserDiets}
          handleUserDietChange={handleUserDietChange}
          selectedCookingTime={selectedCookingTime}
          setSelectedCookingTime={setSelectedCookingTime}
          selectedRecipeDiets={selectedRecipeDiets}
          handleRecipeDietChange={handleRecipeDietChange}
        />
      </aside>

      <div className="lg:hidden p-1">
        <Button
          startContent={<MdFilterList />}
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
        />
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <Sidebar
            selectedUserDiets={selectedUserDiets}
            handleUserDietChange={handleUserDietChange}
            selectedCookingTime={selectedCookingTime}
            setSelectedCookingTime={setSelectedCookingTime}
            selectedRecipeDiets={selectedRecipeDiets}
            handleRecipeDietChange={handleRecipeDietChange}
          />
        </Drawer>
      </div>

      <div className="flex-1 p-4">
        <h2 className="font-semibold text-lg">Users</h2>
        <div className="mt-4 flex flex-col gap-3 items-center">
          {filteredUsers.slice(0, 5).map((user: IUser) => (
            <Card
              key={user._id}
              isHoverable
              isPressable
              onPress={() => handleUserClick(user._id!)}
              style={{ width: "400px" }}
            >
              <CardHeader>
                <Avatar src={user.displayPicture} size="lg" />
                <div className="ml-4 text-start">
                  <h1>{user.name}</h1>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </CardHeader>
            </Card>
          ))}
          {filteredUsers.length > 5 && (
            <Button onPress={() => router.push("/users")}>View More</Button>
          )}
        </div>

        <h2 className=" mt-4 font-semibold text-lg">Recipes</h2>
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-1 gap-4 xl:w-5/12 lg:w-5/12 md:w-7/12 sm:w-auto">
            {filteredRecipes.map((recipe: RecipeInterface) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>

        {/* Suggestions
      {searchText && filteredUsers.length > 0 && (
        <div className="absolute top-3 z-10 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg w-full max-w-xl mt-2 px-4 py-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              role="button"
              tabIndex={0}
              className="flex items-center gap-3 mt-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => handleUserClick(user._id!)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleUserClick(user._id!);
                }
              }}
            >
              <Avatar src={user.displayPicture || ""} size="sm" />
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
        </div>
      )} */}
      </div>
    </div>
  );
};

export default SearchPage;
