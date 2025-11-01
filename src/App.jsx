import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./features/components/OffererUI";
import RemotePeer from "./features/components/remoteUI";
import ChatWidget from "./features/chat/chatUI";

const App = () => {
  return (
    <Router>
      <div className="app-container" style={{ position: "relative", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Base />} />
          <Route path="/share/:id" element={<RemotePeer />} />
        </Routes>
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <ChatWidget />
        </div>
      </div>
    </Router>
  );
};

export default App;
