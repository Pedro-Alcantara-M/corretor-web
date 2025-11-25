// AppRoutes.tsx
import { Route, Routes } from "react-router-dom";
import Home from "@pages/Home";
import NotFound from "@pages/NotFound";
import LoginPage from "@pages/Login";
import { RequiredAuth } from "./RequiredAuth";
import EssayPage from "@pages/Essay";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/sign-in" element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<RequiredAuth />}>
        <Route path="/" element={<Home />} />
         <Route path="/essay" element={<EssayPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
