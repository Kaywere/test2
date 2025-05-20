import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "/element/:id", file: "routes/element.tsx" },
  { path: "/about", file: "routes/about.tsx" }
] satisfies RouteConfig;
