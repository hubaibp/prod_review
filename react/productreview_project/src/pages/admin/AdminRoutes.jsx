import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
    const role = sessionStorage.getItem("role");

    return role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
