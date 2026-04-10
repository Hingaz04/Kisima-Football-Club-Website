import { createAuthProvider } from "react-token-auth";

export const { useAuth, authFetch, login, logout } = createAuthProvider({
  getAccessToken: (session) => session.accessToken,
  storage: localStorage,
  onUpdateToken: (token) =>
    fetch(
      "https://kisima-football-club-website-27xr.onrender.com/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken: token.refreshToken }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((r) => r.json()),
});
