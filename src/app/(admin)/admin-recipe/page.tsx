"use client";

import {
  Spinner,
  Table,
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Slider,
  Switch,
} from "@nextui-org/react";
import { useState } from "react";

import { useDeleteRecipe, useFetchRecipes } from "@/src/hooks/post.hooks";
import { RecipeInterface } from "@/src/components/post/UserRecipePost";

const AdminRecipe = () => {
  const {
    data: recipeData,
    isLoading: recipeLoading,
    error: recipeError,
  } = useFetchRecipes();
  const deleteRecipeMutation = useDeleteRecipe();

  const [searchTerm, setSearchTerm] = useState("");
  const [reportFilter, setReportFilter] = useState<[number, number]>([1, 100]);
  const [showReportedOnly, setShowReportedOnly] = useState(false); // Switch state

  // Sort the recipes by creation date (newest first)
  const sortedRecipes =
    recipeData
      ?.slice()
      .sort(
        (a: RecipeInterface, b: RecipeInterface) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) || [];

  // Filter logic based on the switch and the report number
  const filteredRecipes = sortedRecipes.filter((recipe: RecipeInterface) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.authorId.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (showReportedOnly) {
      // Only include recipes within the report range
      return (
        recipe.report >= reportFilter[0] &&
        recipe.report <= reportFilter[1] &&
        matchesSearch
      );
    } else {
      // Show all recipes when the switch is off
      return matchesSearch;
    }
  });

  if (recipeLoading)
    return (
      <div className="flex flex-col justify-center items-center">
        <Spinner color="white" size="lg" className="my-8" />
      </div>
    );
  if (recipeError) return <div>Error: {recipeError.message}</div>;

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(`Are you sure you want to delete the recipe "${title}"?`)
    ) {
      deleteRecipeMutation.mutate(id); // Trigger the mutation to delete the recipe
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      <p className="text-xl font-bold mb-4">
        Total recipes: {filteredRecipes.length}
      </p>

      {/* Search Input */}
      <div className="w-full max-w-3xl mb-4">
        <Input
          placeholder="Search by Recipe Title or Author Name"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Toggle Switch for reported recipes */}
      <div className="w-full max-w-3xl mb-6 flex justify-between items-center">
        <p className="text-md font-medium">Show Only Reported Recipes</p>
        <Switch
          checked={showReportedOnly}
          onChange={() => setShowReportedOnly(!showReportedOnly)}
        />
      </div>

      {/* Show Report Filter Slider only if 'Show Reported Recipes' is true */}
      {showReportedOnly && (
        <div className="w-full max-w-3xl mb-6">
          <p className="mb-2">
            Filter by Report Number ({reportFilter[0]} - {reportFilter[1]})
          </p>
          <Slider
            step={1}
            minValue={1}
            maxValue={100}
            defaultValue={[1, 100]} // Default range of reports
            value={reportFilter} // Controlled value
            onChange={(value) => setReportFilter(value as [number, number])}
            className="max-w-md"
          />
        </div>
      )}

      {/* Recipe Table */}
      <Table
        aria-label="Recipes"
        shadow="md"
        className="w-full max-w-5xl overflow-auto p-1 rounded-xl"
      >
        <TableHeader>
          <TableColumn>Recipe Title</TableColumn>
          <TableColumn>Author Name</TableColumn>
          <TableColumn>Report Number</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredRecipes.map((recipe: RecipeInterface) => (
            <TableRow key={recipe._id}>
              <TableCell>{recipe.title}</TableCell>
              <TableCell>{recipe.authorId.name}</TableCell>
              <TableCell>{recipe.report}</TableCell>
              <TableCell>
                <Button
                  color="danger"
                  onClick={() => handleDelete(recipe._id, recipe.title)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminRecipe;
