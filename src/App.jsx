import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PageNotFound from "./pages/others/PageNotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/app/:appId" element={<AppDetails />} /> */}
          {/* <Route path="/categories" element={<Categories />} /> */}
          {/* <Route path="/search" element={<Search />} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
