import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Form,
  Button,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import AddProduct from "./admin/AddProduct";
import { listCategories } from "../api/fetchApi";

function Header() {
  const [hover, setHover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);

  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setSearchQuery("");

    listCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, [location.pathname]);

  return (
    <div>
      <Navbar className="bg-primary px-3">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link
              to={role === "admin" ? "/admin-home" : "/"}
              className="navbar-brand d-flex align-items-center"
            >
              <img src={logo} className="logo" />
            </Link>
            <Nav className="me-auto d-flex align-items-center">
              <NavDropdown
                title={<span style={{ color: "white" }}>Categories</span>}
                id="categories-dropdown"
                className="mx-3"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <NavDropdown.Item
                      key={cat.id}
                      as={Link}
                      to={`/category/${cat.id}`}
                    >
                      {cat.category_name}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>

            <Form className="d-flex mx-auto" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Search for products..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="warning" size="ms" type="submit">
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ color: "#fff" }}
                ></i>
              </Button>
            </Form>
          </div>

          <div className="d-flex align-items-center mx-3">
            {token ? (
              <Button
                variant="link"
                style={{
                  textDecoration: "none",
                  color: "#bc4b4b",
                  fontWeight: "500",
                  padding: 0,
                }}
                onClick={handleLogout}
              >
                <i
                  className="fa-solid fa-right-from-bracket"
                  style={{ fontSize: "1.0rem", marginRight: "6px" }}
                ></i>
                Logout
              </Button>
            ) : (
              <Link to="/login" className="text-white navbar-brand">
                <Button
                  variant="link"
                  style={{
                    textDecoration: "none",
                    color: "#6fc746",
                    fontWeight: "500",
                    padding: 0,
                  }}
                >
                  <i
                    className="fa-solid fa-right-to-bracket"
                    style={{ fontSize: "1.0rem", marginRight: "6px" }}
                  ></i>
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-end gap-3">
            {role === "admin" ? (
              <>
                <Link
                  to={"/admin-home"}
                  className="text-white navbar-brand"
                  style={{ fontSize: "small" }}
                >
                  Home
                </Link>
                <AddProduct />
              </>
            ) : (
              <>
                {token && (
                  <>
                    <Link
                      to={"/profile"}
                      className="text-white navbar-brand position-relative"
                      style={{ fontSize: "0.8rem" }}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      <i
                        className="fa-solid fa-user"
                        style={{ color: "#ffffff", fontSize: "1rem" }}
                      ></i>{" "}
                      My Profile
                      {hover && <span className="tooltip">Profile</span>}
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
