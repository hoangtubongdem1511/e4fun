import { render, screen } from "@testing-library/react";
jest.mock("@/components/common/InteractiveBackground", () => () => null);
import App from "@/App";

test("renders home heading", () => {
  render(<App />);
  const heading = screen.getByText(/English4Fun/i);
  expect(heading).toBeInTheDocument();
});
