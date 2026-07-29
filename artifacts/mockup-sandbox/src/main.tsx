import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// auto-mount global music player for this app
import "./components/ui/GlobalMusicPlayer";

createRoot(document.getElementById("root")!).render(<App />);
