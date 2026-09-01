import { render, screen } from "@testing-library/react";
import NotificationSnackbar from "./NotificationSnackbar";
import useNotificationStore from "../../hooks/useNotificationStore";

it("shows a notification message", async () => {
  useNotificationStore.setState({
    notification: { message: "Saved successfully", severity: "success" },
  });

  render(<NotificationSnackbar />);

  expect(await screen.findByText("Saved successfully")).toBeDefined();
});