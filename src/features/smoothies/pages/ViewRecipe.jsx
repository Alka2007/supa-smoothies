import { useEffect, useState } from "react";
import { Button, Spin, message } from "antd";
import {
  BookFilled,
  BookOutlined,
  ArrowLeftOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";
import {
  fetchFavouriteRecipeIds,
  toggleRecipeFavourite,
} from "../lib/recipeFavourites";
import { fetchSavedRecipeIds, toggleRecipeSave } from "../lib/recipeSaves";

const ViewRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const [{ data, error }, favouriteIds, savedIds] = await Promise.all([
          supabase
            .from("recepies")
            .select("*, users(full_name, email)")
            .eq("id", id)
            .maybeSingle(),
          fetchFavouriteRecipeIds(user.id),
          fetchSavedRecipeIds(user.id),
        ]);

        if (error) {
          throw error;
        }

        if (!data || data.user_id === user.id) {
          navigate("/explore", { replace: true });
          return;
        }

        setRecipe(data);
        setIsFavourite(favouriteIds.has(data.id));
        setIsSaved(savedIds.has(data.id));
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Could not load this recipe.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!user?.id) {
      return;
    }

    fetchRecipe();
  }, [id, navigate, user?.id]);

  const handleToggleFavourite = async () => {
    if (!user?.id || !recipe?.id) {
      return;
    }

    const currentValue = isFavourite;
    setIsFavourite(!currentValue);

    try {
      const nextValue = await toggleRecipeFavourite({
        userId: user.id,
        recipeId: recipe.id,
        isFavourite: currentValue,
      });

      setIsFavourite(nextValue);
    } catch (error) {
      console.error(error);
      setIsFavourite(currentValue);
      message.error("Could not update liked recipes.");
    }
  };

  const handleToggleSave = async () => {
    if (!user?.id || !recipe?.id) {
      return;
    }

    const currentValue = isSaved;
    setIsSaved(!currentValue);

    try {
      const nextValue = await toggleRecipeSave({
        userId: user.id,
        recipeId: recipe.id,
        isSaved: currentValue,
      });

      setIsSaved(nextValue);
    } catch (error) {
      console.error(error);
      setIsSaved(currentValue);
      message.error("Could not update saved recipes.");
    }
  };

  if (isLoading) {
    return (
      <div className="page recipe-view-page recipe-view-page--loading">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="page recipe-view-page">
        <div className="recipe-view-card">
          <p className="eyebrow">Recipe unavailable</p>
          <h2>We could not open this recipe.</h2>
          <p>{error || "This recipe may have been removed."}</p>
          <Link to="/explore">
            <Button type="primary">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page recipe-view-page">
      <Link to="/explore" className="back-link">
        <ArrowLeftOutlined />
        <span>Back to Explore</span>
      </Link>

      <article className="recipe-view-card">
        <div className="recipe-view-card__header">
          <div>
            <h1>{recipe?.title}</h1>
            <p className="recipe-view-card__author">
              Shared by {recipe?.users?.full_name ?? "Another foodie"}
            </p>
          </div>
          <div className="recipe-view-card__actions">
            <button
              type="button"
              className={`recipe-save-button ${isSaved ? "recipe-save-button--active" : ""}`}
              onClick={handleToggleSave}
            >
              {isSaved ? <BookFilled /> : <BookOutlined />}
              <span>{isSaved ? "Saved" : "Save recipe"}</span>
            </button>
            <button
              type="button"
              className={`recipe-like-button ${isFavourite ? "recipe-like-button--active" : ""}`}
              onClick={handleToggleFavourite}
            >
              {isFavourite ? <HeartFilled /> : <HeartOutlined />}
              <span>{isFavourite ? "Liked" : "Like recipe"}</span>
            </button>
            <div className="recipe-pill">
              <span>Rating</span>
              <strong>{recipe?.rating}/10</strong>
            </div>
          </div>
        </div>

        <div className="recipe-view-card__section">
          <h3>Method</h3>
          <p>{recipe?.method}</p>
        </div>
      </article>
    </div>
  );
};

export default ViewRecipe;
