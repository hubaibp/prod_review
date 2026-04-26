import "./App.css";
import "./bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Detail from "./pages/Detail";
import SearchResults from "./pages/SearchResults";
import CategoryProducts from "./pages/CategoryProducts";
import AdminRoutes from "./pages/admin/AdminRoutes";
import AdminHome from "./pages/admin/AdminHome";
import AddProduct from "./pages/admin/AddProduct";
import AdminContextApi from "./AdminContextApi";
import UserProfile from "./pages/UserProfile";
function App() {
  return (
    <AdminContextApi>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/product/:id" element={<Detail />} />
            <Route path="/category/:id" element={<CategoryProducts />} />


            <Route element={<AdminRoutes />}>
              <Route path="/admin-home" element={<AdminHome />} />
              <Route path="/admin-add-product" element={<AddProduct />} />
            </Route>
          </Routes>
        </div>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </AdminContextApi>
  );
}

export default App;
