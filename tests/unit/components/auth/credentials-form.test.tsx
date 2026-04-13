import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CredentialsForm } from "@/components/auth/credentials-form";

const { replaceLocation, router, signInEmail, signUpEmail } = vi.hoisted(() => ({
  replaceLocation: vi.fn(),
  router: {
    refresh: vi.fn(),
    replace: vi.fn(),
  },
  signInEmail: vi.fn(),
  signUpEmail: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("@/auth/client", () => ({
  authClient: {
    signIn: {
      email: signInEmail,
    },
    signUp: {
      email: signUpEmail,
    },
  },
}));

vi.mock("@/auth/client-navigation", () => ({
  replaceLocation,
}));

describe("CredentialsForm", () => {
  beforeEach(() => {
    replaceLocation.mockReset();
    router.refresh.mockReset();
    router.replace.mockReset();
    signInEmail.mockReset();
    signUpEmail.mockReset();
  });

  it("submits the derived display name during registration and redirects on success", async () => {
    signUpEmail.mockResolvedValueOnce({ error: null });

    render(
      <CredentialsForm
        companionHref="/login"
        companionLabel="Already have an account?"
        description="Create an account."
        mode="register"
        submitLabel="Create account"
        title="Register"
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Create account" })).toHaveProperty(
        "disabled",
        false,
      );
    });

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "alex.smith@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "Password-1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(signUpEmail).toHaveBeenCalledWith({
        email: "alex.smith@example.com",
        name: "Alex Smith",
        password: "Password-1234",
      });
    });

    await waitFor(() => {
      expect(replaceLocation).toHaveBeenCalledWith("/notes");
    });
  });

  it("shows the login error message when the auth client rejects credentials", async () => {
    signInEmail.mockResolvedValueOnce({
      error: {
        message: "Invalid credentials",
      },
    });

    render(
      <CredentialsForm
        companionHref="/register"
        companionLabel="Create an account"
        description="Sign in."
        mode="login"
        submitLabel="Sign in"
        title="Login"
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sign in" })).toHaveProperty("disabled", false);
    });

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "Password-1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Unable to sign in with those credentials.")).toBeTruthy();
    expect(replaceLocation).not.toHaveBeenCalled();
  });

  it("shows the login error message when the auth request throws", async () => {
    signInEmail.mockRejectedValueOnce(new Error("network failure"));

    render(
      <CredentialsForm
        companionHref="/register"
        companionLabel="Create an account"
        description="Sign in."
        mode="login"
        submitLabel="Sign in"
        title="Login"
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sign in" })).toHaveProperty("disabled", false);
    });

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "Password-1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Unable to sign in with those credentials.")).toBeTruthy();
  });
});
