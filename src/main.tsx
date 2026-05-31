import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { SiteSettingsProvider } from "./hooks/useSiteSettings";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <SiteSettingsProvider>
      <App />
    </SiteSettingsProvider>
  </HelmetProvider>
);
