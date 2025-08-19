import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Home from "@pages/Home";
import NotFound from "@pages/NotFound";
import LoginPage from "@pages/Login";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <Home />
          </Suspense>
        }
      />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
