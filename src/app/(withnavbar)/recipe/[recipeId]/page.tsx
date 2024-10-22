import SingleRecipe from "@/src/components/post/SingleRecipe";

interface IProps {
  params: {
    recipeId: string;
  };
}

export default function RecipePage({ params: { recipeId } }: IProps) {
  return (
    <div>
      <SingleRecipe
        params={{
          recipeId: recipeId,
        }}
      />
    </div>
  );
}
