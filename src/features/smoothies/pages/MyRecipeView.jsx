import { useEffect, useState } from "react";
import { Button, Modal, Spin, message } from "antd";
import { ArrowLeftOutlined, DeleteFilled, EditFilled } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";

const MyRecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("recepies")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          navigate("/", { replace: true });
          return;
        }

        setRecipe(data);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Could not load this smoothie recipe.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!user?.id) {
      return;
    }

    fetchRecipe();
  }, [id, navigate, user?.id]);

  const handleDelete = async () => {
    if (!user?.id || !recipe?.id) {
      message.error("You need to be signed in to delete a recipe.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("recepies")
        .delete()
        .eq("id", recipe.id)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        message.error(
          "You do not have permission to delete this smoothie, or it no longer exists."
        );
        return;
      }

      message.success("Smoothie recipe deleted.");
      navigate("/");
    } catch (error) {
      console.log(error);
      message.error("Could not delete the smoothie. Please try again.");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Delete smoothie?",
      content: `This will permanently delete "${recipe.title}".`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: handleDelete,
    });
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
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page recipe-view-page">
      <Link to="/" className="back-link">
        <ArrowLeftOutlined />
        <span>Back to Home</span>
      </Link>

      <article className="recipe-view-card">
        <div className="recipe-view-card__header">
          <div>
            <p className="eyebrow">Your recipe</p>
            <h1>{recipe.title}</h1>
            <p className="recipe-view-card__author">
              Saved in your private smoothie board.
            </p>
          </div>
          <div className="recipe-view-card__actions">
            <Link to={`/${recipe.id}`} className="recipe-view-edit-link">
              <EditFilled />
              <span>Edit recipe</span>
            </Link>
            <div className="recipe-pill">
              <span>Rating</span>
              <strong>{recipe.rating}/10</strong>
            </div>
          </div>
        </div>

        <div className="recipe-view-card__section">
          <h3>Method</h3>
          <p>{recipe.method}</p>
        </div>

        <div className="recipe-view-card__danger-zone">
          <div>
            <h3>Danger zone</h3>
            <p>Delete this recipe if you no longer want it on your smoothie board.</p>
          </div>
          <button
            type="button"
            className="recipe-view-delete-button"
            onClick={showDeleteConfirm}
          >
            <DeleteFilled />
            <span>Delete recipe</span>
          </button>
        </div>
      </article>
    </div>
  );
};

export default MyRecipeView;
