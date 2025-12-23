import { render, screen } from "@testing-library/react";
import React from "react";
import LoginPage from "@/app/[locale]/login/page";

describe("LoginPage", () => {
  it("renders heading", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});
