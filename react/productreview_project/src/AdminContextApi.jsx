import React, { createContext, useState, useEffect } from "react";
import { listAdminProducts } from "./api/fetchApi";

export const AdminContext = createContext();

function AdminContextApi({ children }) {
  const [adminProducts, setAdminProducts] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  const fetchProducts = () => {
    if (!token) return;

    const headers = {
      Authorization: `token ${token}`,
    };

    listAdminProducts(headers)
      .then((res) => {
        if (res.data) {
          setAdminProducts(res.data);
        } else {
          setAdminProducts([]);
        }
      })
      .catch((err) => console.error("Error fetching admin products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  return (
    <AdminContext.Provider
      value={{ adminProducts, fetchProducts, setAdminProducts }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContextApi;
