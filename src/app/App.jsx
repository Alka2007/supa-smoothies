import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicOnlyRoute from "../routes/PublicOnlyRoute";
import Home from "../features/smoothies/pages/Home";
import Create from "../features/smoothies/pages/Create";
import Update from "../features/smoothies/pages/Update";
import Explore from "../features/smoothies/pages/Explore";
import ViewRecipe from "../features/smoothies/pages/ViewRecipe";
import MyRecipeView from "../features/smoothies/pages/MyRecipeView";
import LikedRecipes from "../features/smoothies/pages/LikedRecipes";
import SavedRecipes from "../features/smoothies/pages/SavedRecipes";
import Settings from "../features/smoothies/pages/Settings";
import Profile from "../features/smoothies/pages/Profile";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<MyRecipeView />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:id" element={<ViewRecipe />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/liked" element={<LikedRecipes />} />
            <Route path="/settings/saved" element={<SavedRecipes />} />
            <Route path="/settings/profile" element={<Profile />} />
            <Route path="/create" element={<Create />} />
            <Route path="/:id" element={<Update />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
