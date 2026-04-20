import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const renderLogin = (contextOverrides = {}) => {
  const authValue = {
    currentUser: null,
    setCurrentUser: vi.fn(),
    csrfToken: "valid-token",
    ...contextOverrides,
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe("Login", () => {
  it("shows an error for empty fields", () => {
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText("Cannot submit empty fields.")).toBeInTheDocument();
  });

  it("shows an error when csrf token is missing", () => {
    renderLogin({ csrfToken: "" });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "simpleUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      screen.getByText("Security token is missing. Please refresh and try again."),
    ).toBeInTheDocument();
  });
});
