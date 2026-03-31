import { useEffect, useState } from "react";
import { Input, Select } from "antd";
import { supabase } from "../../../lib/supabase";
import SmoothieCard from "../components/SmoothieCard";
import { useAuth } from "../../../hooks/useAuth";

const sortOptions = [
  { label: "Created Time", value: "created_at" },
  { label: "Title", value: "title" },
  { label: "Rating", value: "rating" },
];

const Home = () => {
  const { profile, user } = useAuth();
  const [error, setError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = () => {
    setRefreshKey((currentValue) => currentValue + 1);
  };

  useEffect(() => {
    const fetchSmoothies = async () => {
      try {
        const isAscending = orderBy === "title";
        const trimmedSearch = searchTerm.trim();
        let query = supabase
          .from("recepies")
          .select("*")
          .eq("user_id", user.id)
          .order(orderBy, { ascending: isAscending });

        if (trimmedSearch) {
          query = query.or(
            `title.ilike.%${trimmedSearch}%,method.ilike.%${trimmedSearch}%`,
          );
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          setSmoothies(data);
          setError(null);
        }
      } catch (error) {
        console.log(error);
        setError("Could not fetch the smoothies.");
      }
    };

    if (!user?.id) {
      return;
    }

    fetchSmoothies();
  }, [orderBy, refreshKey, searchTerm, user?.id]);

  return (
    <div className="page home">
      <section className="home-hero">
        <div>
          <p className="eyebrow">Your dashboard</p>
          <h2>
            Hi {profile?.full_name || "there"}, ready to blend something new?
          </h2>
          <p>
            Browse your smoothie board, sort recipes your way, and jump back
            into edits quickly.
          </p>
        </div>
      </section>

      {error && <p>{error}</p>}

      <div className="order-by">
        <p>Find and sort</p>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search smoothies by title or method"
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
            <p className="empty-state">No smoothies match that search yet.</p>
          ) : (
            <div className="smoothie-grid">
              {smoothies?.map((smoothie) => (
                <SmoothieCard
                  key={smoothie?.id}
                  smoothie={smoothie}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
