import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const Profile = () => {
  const { profile, user } = useAuth();

  const displayName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name ||
    "Smoothie lover";

  const joinedOn = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unavailable";

  return (
    <div className="page profile-page">
      <Link to="/settings" className="back-link">
        <ArrowLeftOutlined />
        <span>Back to Settings</span>
      </Link>

      <section className="home-hero profile-hero">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Your smoothie account details.</h2>
          <p>
            This is the information currently available for your signed-in
            profile.
          </p>
        </div>
      </section>

      <div className="profile-card">
        <div className="profile-card__grid">
          <div className="profile-field">
            <span>Full Name</span>
            <strong>{displayName}</strong>
          </div>
          <div className="profile-field">
            <span>Email</span>
            <strong>{user?.email || "Unavailable"}</strong>
          </div>
          <div className="profile-field">
            <span>Joined</span>
            <strong>{joinedOn}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
