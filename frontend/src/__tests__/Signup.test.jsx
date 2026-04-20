import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../Signup.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const renderSignup = (contextOverrides = {}) => {
  const authValue = {
    currentUser: null,
    setCurrentUser: vi.fn(),
    csrfToken: "valid-token",
    ...contextOverrides,
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <Signup />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe("Signup", () => {
  it("shows an error when passwords do not match", () => {
    renderSignup();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "simpleUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Different1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });
});
