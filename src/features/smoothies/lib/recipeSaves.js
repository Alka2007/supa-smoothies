import { supabase } from "../../../lib/supabase";

export const fetchSavedRecipeIds = async (userId) => {
  const { data, error } = await supabase
    .from("recipe_saves")
    .select("recipe_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return new Set((data ?? []).map((item) => item.recipe_id));
};

export const toggleRecipeSave = async ({ isSaved, recipeId, userId }) => {
  if (isSaved) {
    const { error } = await supabase
      .from("recipe_saves")
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipeId);

    if (error) {
      throw error;
    }

    return false;
  }

  const { error } = await supabase.from("recipe_saves").insert({
    user_id: userId,
    recipe_id: recipeId,
  });

  if (error) {
    throw error;
  }

  return true;
};
