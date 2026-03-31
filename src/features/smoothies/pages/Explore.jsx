import { useEffect, useState } from "react";
import { Input, Select, message } from "antd";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";
import ExploreCard from "../components/ExploreCard";
import {
  fetchFavouriteRecipeIds,
  toggleRecipeFavourite,
} from "../lib/recipeFavourites";
import { fetchSavedRecipeIds, toggleRecipeSave } from "../lib/recipeSaves";

const sortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Title", value: "title" },
  { label: "Rating", value: "rating" },
];

const Explore = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchExploreSmoothies = async () => {
    try {
      const isAscending = orderBy === "title";
      const trimmedSearch = searchTerm.trim();
      let query = supabase
        .from("recepies")
        .select("*, users(full_name)")
        .neq("user_id", user.id)
        .order(orderBy, { ascending: isAscending });

      if (trimmedSearch) {
        query = query.or(
          `title.ilike.%${trimmedSearch}%,method.ilike.%${trimmedSearch}%`
        );
      }

      const [{ data, error }, favouriteIds, savedIds] = await Promise.all([
        query,
        fetchFavouriteRecipeIds(user.id),
        fetchSavedRecipeIds(user.id),
      ]);

      if (error) {
        throw error;
      }

      const recipes = data ?? [];

      setSmoothies(
        recipes.map((recipe) => ({
          ...recipe,
          isFavourite: favouriteIds.has(recipe.id),
          isSaved: savedIds.has(recipe.id),
        }))
      );
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Could not load recipes from other users.");
    }
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetchExploreSmoothies();
  }, [orderBy, searchTerm, user?.id]);

  const handleToggleFavourite = async (recipeId, currentValue) => {
    if (!user?.id) {
      return;
    }

    try {
      await toggleRecipeFavourite({
        userId: user.id,
        recipeId,
        isFavourite: currentValue,
      });
      await fetchExploreSmoothies();
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
      await toggleRecipeSave({
        userId: user.id,
        recipeId,
        isSaved: currentValue,
      });
      await fetchExploreSmoothies();
    } catch (error) {
      console.error(error);
      message.error("Could not update saved recipes.");
    }
  };

  return (
    <div className="page explore-page">
      <section className="home-hero explore-hero">
        <div>
          <p className="eyebrow">Community blend</p>
          <h2>Explore what other smoothie makers are sharing.</h2>
          <p>
            Browse recipes from the rest of the community and open any one in a
            clean, view-only recipe page.
          </p>
        </div>
      </section>

      {error && <p>{error}</p>}

      <div className="order-by">
        <p>Search and sort</p>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search community recipes"
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

      {smoothies && (
        <div className="smoothies">
          {smoothies.length === 0 ? (
            <p className="empty-state">
              No community recipes match that search right now.
            </p>
          ) : (
            <div className="smoothie-grid">
              {smoothies?.map((smoothie) => (
                <ExploreCard
                  key={smoothie?.id}
                  smoothie={smoothie}
                  isFavourite={smoothie?.isFavourite}
                  isSaved={smoothie?.isSaved}
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

export default Explore;
