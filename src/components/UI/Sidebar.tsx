import { Checkbox, CheckboxGroup, Input } from "@nextui-org/react";

export const Sidebar = ({
  selectedUserDiets,
  handleUserDietChange,
  selectedCookingTime,
  setSelectedCookingTime,
  selectedRecipeDiets,
  handleRecipeDietChange,
}: any) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Filter Users</h3>
      <CheckboxGroup
        label="Diet"
        onChange={handleUserDietChange}
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
        value={selectedCookingTime}
        onChange={(e) => setSelectedCookingTime(Number(e.target.value))}
      />
      <CheckboxGroup
        label="Diet"
        onChange={handleRecipeDietChange}
        value={selectedRecipeDiets}
      >
        <Checkbox value="vegan">Vegan</Checkbox>
        <Checkbox value="veg">Vegetarian</Checkbox>
        <Checkbox value="non-veg">Non-Vegetarian</Checkbox>
      </CheckboxGroup>
    </div>
  );
};
