import {
  BookFilled,
  BookOutlined,
  EyeFilled,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const ExploreCard = ({
  smoothie,
  isFavourite = false,
  isSaved = false,
  onToggleFavourite,
  onToggleSave,
}) => {
  const handleToggle = () => {
    onToggleFavourite?.(smoothie.id, isFavourite);
  };
  const handleSaveToggle = () => {
    onToggleSave?.(smoothie.id, isSaved);
  };

  return (
    <article className="smoothie-card smoothie-card--explore">
      <div>
        <p className="smoothie-card__meta">
          By {smoothie?.users?.full_name || smoothie?.users?.email || "Another smoothie lover"}
        </p>
        <h3>{smoothie?.title}</h3>
        <p>{smoothie?.method}</p>
        <div className="rating">{smoothie?.rating}</div>
      </div>

      <div className="buttons">
        <button
          type="button"
          className={`icon border-0 ${isSaved ? "icon--saved" : ""}`}
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Remove from saved recipes" : "Save recipe"}
        >
          {isSaved ? (
            <BookFilled style={{ color: "#0f8f7e", fontSize: 20 }} />
          ) : (
            <BookOutlined style={{ color: "gray", fontSize: 20 }} />
          )}
        </button>
        <button
          type="button"
          className={`icon border-0 ${isFavourite ? "icon--liked" : ""}`}
          onClick={handleToggle}
          aria-label={isFavourite ? "Remove from liked recipes" : "Add to liked recipes"}
        >
          {isFavourite ? (
            <HeartFilled style={{ color: "#f25f5c", fontSize: 20 }} />
          ) : (
            <HeartOutlined style={{ color: "gray", fontSize: 20 }} />
          )}
        </button>
        <Link className="icon" to={`/explore/${smoothie?.id}`}>
          <EyeFilled style={{ color: "gray", fontSize: 20 }} />
        </Link>
      </div>
    </article>
  );
};

export default ExploreCard;
