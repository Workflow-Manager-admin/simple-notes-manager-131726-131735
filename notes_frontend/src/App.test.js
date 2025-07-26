import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders no notes state on load", () => {
  render(<App />);
  expect(screen.getByText(/Notes/i)).toBeInTheDocument();
});
