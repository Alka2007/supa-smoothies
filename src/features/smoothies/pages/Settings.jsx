import { Link } from "react-router-dom";
import { BookFilled, HeartFilled, UserOutlined } from "@ant-design/icons";

const settingsItems = [
  {
    title: "Profile",
    description:
      "View the personal details connected to your smoothie account.",
    to: "/settings/profile",
    icon: <UserOutlined />,
  },
  {
    title: "Liked Recipes",
    description: "See all the community recipes you have saved with a like.",
    to: "/settings/liked",
    icon: <HeartFilled />,
  },
  {
    title: "Saved Recipes",
    description: "Open the recipes you bookmarked from Explore for later.",
    to: "/settings/saved",
    icon: <BookFilled />,
  },
];

const Settings = () => {
  return (
    <div className="page settings-page">
      <section className="home-hero settings-hero">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Manage your saved recipes and account details.</h2>
          <p>
            Open a section below to review your liked recipes or check the
            profile details linked to your account.
          </p>
        </div>
      </section>

      <div className="settings-list settings-list--page">
        {settingsItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="settings-item settings-item--link"
          >
            <div className="settings-item__icon">{item.icon}</div>
            <div>
              <span>{item.title}</span>
              <small>{item.description}</small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Settings;
