import Home from "./pages/Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Detailed from "./pages/Detailed.jsx";
import Trading from "./pages/Trading.jsx";
import Sidebar from "./components/Sidebar";
import Balances from './pages/Balances';
import Tracking from "./pages/Tracking";
import Transfer from "./pages/Transfer";
import { SidebarItem } from "./components/Sidebar";
import { UserCircle, LayoutDashboard,Wallet } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar>
          <SidebarItem
            to="/"
            icon={<LayoutDashboard size={20} />}
            text="Home"
          />
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Trading"
            to="/Trading"
          />
          <SidebarItem
            icon={<Wallet size={20} />}
            text="Balances"
            to="/balances"
          />
          <SidebarItem
            icon={<Wallet size={20} />}
            text="Tracking"
            to="/tracking"
          />
          <SidebarItem
            icon={<Wallet size={20} />}
            text="Transfer"
            to="/transfer"
          />
          <hr className="my-3" />
        </Sidebar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/page/:pageNumber" element={<Home />}></Route>
          <Route path="/categories" element={<Home />}></Route>
          <Route path="/Trading" element={<Trading />}></Route>
          <Route path="/balances" element={<Balances />}></Route>
          <Route path="/tracking" element={<Tracking />}></Route>
          <Route path="/transfer" element={<Transfer />}></Route>
          <Route path="/:id" element={<Detailed />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
