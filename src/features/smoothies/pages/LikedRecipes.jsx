import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";
import ExploreCard from "../components/ExploreCard";
import { fetchFavouriteRecipeIds, toggleRecipeFavourite } from "../lib/recipeFavourites";

const sortOptions = [
  { label: "Recently liked", value: "created_at" },
  { label: "Title", value: "title" },
  { label: "Rating", value: "rating" },
];

const LikedRecipes = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("created_at");

  useEffect(() => {
    const loadLikedRecipes = async () => {
      try {
        const favouriteIds = await fetchFavouriteRecipeIds(user.id);
        const likedRecipeIds = [...favouriteIds];

        if (likedRecipeIds.length === 0) {
          setRecipes([]);
          setError(null);
          return;
        }

        const isAscending = orderBy === "title";
        const trimmedSearch = searchTerm.trim();
        let query = supabase
          .from("recepies")
          .select("*, users(full_name, email)")
          .in("id", likedRecipeIds)
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
            isFavourite: true,
          }))
        );
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Could not load your liked recipes.");
      }
    };

    if (!user?.id) {
      return;
    }

    loadLikedRecipes();
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

      if (!nextValue) {
        setRecipes((currentRecipes) =>
          currentRecipes.filter((recipe) => recipe.id !== recipeId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page explore-page">
      <Link to="/settings" className="back-link">
        <ArrowLeftOutlined />
        <span>Back to Settings</span>
      </Link>

      <section className="home-hero liked-hero">
        <div>
          <p className="eyebrow">Your favourites</p>
          <h2>All the smoothie recipes you have liked in one place.</h2>
          <p>
            Revisit the community recipes you bookmarked and open them again
            whenever you want.
          </p>
        </div>
      </section>

      {error && <p>{error}</p>}

      <div className="order-by">
        <p>Search and sort</p>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search liked recipes"
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
              You have not liked any recipes yet. Explore the community and tap
              the heart on recipes you want to save.
            </p>
          ) : (
            <div className="smoothie-grid">
              {recipes.map((recipe) => (
                <ExploreCard
                  key={recipe.id}
                  smoothie={recipe}
                  isFavourite={recipe.isFavourite}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LikedRecipes;
