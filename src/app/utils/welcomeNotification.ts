import { Notification } from "../components/Header";

export const WELCOME_TIMESTAMP_KEY = "welcome_timestamp";

const getWelcomeTimestamp = () => {
  if (typeof window === "undefined") return new Date();

  const saved = localStorage.getItem(WELCOME_TIMESTAMP_KEY);
  if (saved) return new Date(saved);

  const now = new Date();
  localStorage.setItem(WELCOME_TIMESTAMP_KEY, now.toISOString());
  return now;
};

export const welcomeNotification: Notification = {
  id: "welcome",
  type: "info",
  title: "Welcome 🎉",
  message:
    "Welcome to your dashboard! You can manage appointments, customers, and notifications here.",
  timestamp: getWelcomeTimestamp(),
  read: false,
};
