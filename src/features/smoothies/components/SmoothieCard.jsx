import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Modal, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";

const SmoothieCard = ({ smoothie, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!user?.id) {
      message.error("You need to be signed in to delete a recipe.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("recepies")
        .delete()
        .eq("id", smoothie.id)
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

      onDelete();
    } catch (error) {
      console.log(error);
      message.error("Could not delete the smoothie. Please try again.");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Delete smoothie?",
      content: `This will permanently delete "${smoothie.title}".`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: handleDelete,
    });
  };

  return (
    <div
      className="smoothie-card smoothie-card--interactive flex justify-between flex-col"
      onClick={() => navigate(`/recipe/${smoothie.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/recipe/${smoothie.id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div>
        <h3>{smoothie.title}</h3>
        <p>{smoothie.method}</p>
        <div className="rating">{smoothie.rating}</div>
      </div>
      <div className="buttons">
        <Link
          className="icon"
          to={"/" + smoothie.id}
          onClick={(event) => event.stopPropagation()}
        >
          <EditFilled style={{ color: "gray", fontSize: 20 }} />
        </Link>
        <button
          type="button"
          className="icon border-0"
          onClick={(event) => {
            event.stopPropagation();
            showDeleteConfirm();
          }}
        >
          <DeleteFilled style={{ color: "gray" }} />
        </button>
      </div>
    </div>
  );
};

export default SmoothieCard;
