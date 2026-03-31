import { supabase } from "../../../lib/supabase";

export const fetchFavouriteRecipeIds = async (userId) => {
  const { data, error } = await supabase
    .from("recipe_favourites")
    .select("recipe_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return new Set((data ?? []).map((item) => item.recipe_id));
};

export const toggleRecipeFavourite = async ({
  isFavourite,
  recipeId,
  userId,
}) => {
  if (isFavourite) {
    const { error } = await supabase
      .from("recipe_favourites")
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipeId);

    if (error) {
      throw error;
    }

    return false;
  }

  const { error } = await supabase.from("recipe_favourites").insert({
    user_id: userId,
    recipe_id: recipeId,
  });

  if (error) {
    throw error;
  }

  return true;
};
