import { HashRouter as Router } from "react-router-dom";
import { Chatspace } from "./components/Chatspace";
import { OfflineStatusProvider } from "./context/useOfflineStatus";
import "./components/Scroll.css";

function App() {
  return (
    <Router basename="/chats">
      <OfflineStatusProvider>
        <Chatspace />
      </OfflineStatusProvider>
    </Router>
  );
}

export default App;
