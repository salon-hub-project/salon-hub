import { Notification } from "../components/Header";

export const WELCOME_SEEN_KEY = "welcome_seen";

export const welcomeNotification: Notification = {
  id: "welcome",
  type: "info",
  title: "Welcome 🎉",
  message:
    "Welcome to your dashboard! You can manage appointments, customers, and notifications here.",
  timestamp: new Date(),
  read: false,
};
