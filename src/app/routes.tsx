import { createHashRouter, Navigate } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import AIAssistantPage from "../pages/AIAssistantPage";

export const router = createHashRouter([
  { path: "/", Component: () => <Navigate to="/dashboard" replace /> },
  { path: "/dashboard", Component: DashboardPage },
  { path: "/dashboard/:customerCode", Component: DashboardPage },
  { path: "/assistant", Component: AIAssistantPage },
]);