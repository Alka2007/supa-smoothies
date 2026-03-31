import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Input, Select, message } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";
import ExploreCard from "../components/ExploreCard";
import { fetchFavouriteRecipeIds, toggleRecipeFavourite } from "../lib/recipeFavourites";
import { fetchSavedRecipeIds, toggleRecipeSave } from "../lib/recipeSaves";

const sortOptions = [
  { label: "Recently saved", value: "created_at" },
  { label: "Title", value: "title" },
  { label: "Rating", value: "rating" },
];

const SavedRecipes = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("created_at");

  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        const [savedIds, favouriteIds] = await Promise.all([
          fetchSavedRecipeIds(user.id),
          fetchFavouriteRecipeIds(user.id),
        ]);
        const recipeIds = [...savedIds];

        if (recipeIds.length === 0) {
          setRecipes([]);
          setError(null);
          return;
        }

        const isAscending = orderBy === "title";
        const trimmedSearch = searchTerm.trim();
        let query = supabase
          .from("recepies")
          .select("*, users(full_name, email)")
          .in("id", recipeIds)
          .order(orderBy, { ascending: isAscending });

        if (trimmedSearch) {
          query = query.or(
            `title.ilike.%${trimmedSearch}%,method.ilike.%${trimmedSearch}%`
          );
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setRecipes(
          (data ?? []).map((recipe) => ({
            ...recipe,
            isFavourite: favouriteIds.has(recipe.id),
            isSaved: true,
          }))
        );
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Could not load your saved recipes.");
      }
    };

    if (!user?.id) {
      return;
    }

    loadSavedRecipes();
  }, [orderBy, searchTerm, user?.id]);

  const handleToggleFavourite = async (recipeId, currentValue) => {
    if (!user?.id) {
      return;
    }

    try {
      const nextValue = await toggleRecipeFavourite({
        userId: user.id,
        recipeId,
        isFavourite: currentValue,
      });

      setRecipes((currentRecipes) =>
        currentRecipes?.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, isFavourite: nextValue } : recipe
        )
      );
    } catch (error) {
      console.error(error);
      message.error("Could not update liked recipes.");
    }
  };

  const handleToggleSave = async (recipeId, currentValue) => {
    if (!user?.id) {
      return;
    }

    try {
      const nextValue = await toggleRecipeSave({
        userId: user.id,
        recipeId,
        isSaved: currentValue,
      });

      if (!nextValue) {
        setRecipes((currentRecipes) =>
          currentRecipes.filter((recipe) => recipe.id !== recipeId)
        );
      }
    } catch (error) {
      console.error(error);
      message.error("Could not update saved recipes.");
    }
  };

  return (
    <div className="page explore-page">
      <Link to="/settings" className="back-link">
        <ArrowLeftOutlined />
        <span>Back to Settings</span>
      </Link>

      <section className="home-hero saved-hero">
        <div>
          <p className="eyebrow">Your saves</p>
          <h2>All the recipes you bookmarked for later.</h2>
          <p>
            Keep a separate collection of recipes you want to revisit, compare,
            or try the next time you blend something new.
          </p>
        </div>
      </section>

      {error && <p>{error}</p>}

      <div className="order-by">
        <p>Search and sort</p>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search saved recipes"
          allowClear
          className="search-input"
        />
        <Select
          value={orderBy}
          onChange={setOrderBy}
          options={sortOptions}
          className="order-select"
        />
      </div>

      {recipes && (
        <div className="smoothies">
          {recipes.length === 0 ? (
            <p className="empty-state">
              You have not saved any recipes yet. Save recipes from Explore to
              keep them here.
            </p>
          ) : (
            <div className="smoothie-grid">
              {recipes.map((recipe) => (
                <ExploreCard
                  key={recipe.id}
                  smoothie={recipe}
                  isFavourite={recipe.isFavourite}
                  isSaved={recipe.isSaved}
                  onToggleFavourite={handleToggleFavourite}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
