import { Route, Routes } from "react-router";
import { LoginPage } from "../ui/pages/auth/login-page";
import { SignupPage } from "../ui/pages/auth/signup-page";
import { LobbyPage } from "../ui/pages/lobby-page";
import { HomePage } from "../ui/pages/home-page";
import { NotFoundPage } from "../ui/pages/not-found-page";
import { GamePage } from "../ui/pages/game-page";
import { GuestRoute, ProtectedRoute } from "../auth";

export function AppRouter() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="auth">
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
      </Route>

      <Route
        path="lobby"
        element={
          <ProtectedRoute>
            <LobbyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="game"
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
