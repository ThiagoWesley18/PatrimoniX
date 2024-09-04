import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import TransactionPage from "./pages/TransactionPage";
import TransactionPageCreate from "./pages/TransactionPageCreate";
import TransactionPageUpdate from "./pages/TransactionPageUpdate";
import TransactionPageRead from "./pages/TransactionPageRead";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MetaPageCreate from "./pages/MetaPageCreate";
import CalculadoraPage from "./pages/CalculadoraPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthProvider from "./state/AuthProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PerfilPage from "./pages/PerfilPage";
import SuportePage from "./pages/SuportePage";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { authService } from "./services/api";
import SobrePage from "./pages/SobrePage";
import MetasPage from "./pages/MetasPage";
import MetaPageUpdate from "./pages/MetasPageUpdate";

const checkAuth = async () => {
  try {
    const auth = await authService();
    return auth;
  } catch (err) {
    console.log("Erro ao recuperar o estado");
  }
};

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    (async () => {
      setIsAuth(await checkAuth());
    })();
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  if (isAuth) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
};

const Layout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/wallet"
          element={
            <PrivateRoute>
              <TransactionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction/create"
          element={
            <PrivateRoute>
              <TransactionPageCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction/update/:id"
          element={
            <PrivateRoute>
              <TransactionPageUpdate />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction/:id"
          element={
            <PrivateRoute>
              <TransactionPageRead />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction/history"
          element={
            <PrivateRoute>
              <TransactionHistoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <PerfilPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/aporte"
          element={
            <PrivateRoute>
              <CalculadoraPage />
            </PrivateRoute>
          }
        />
        <Route 
          path="/metas" 
          element={
            <PrivateRoute>
              <MetasPage/>
            </PrivateRoute>
          }
        />
        <Route 
          path="/metas/create" 
          element={
            <PrivateRoute>
              <MetaPageCreate/>
            </PrivateRoute>
          }
        />
        <Route 
          path="/metas/update/:nome" 
          element={
            <PrivateRoute>
              <MetaPageUpdate/>
            </PrivateRoute>
          }
        />
        <Route
          path="/sobre"
          element={
            <PrivateRoute>
              <SobrePage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/graficos"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/suporte"
          element={
            <PrivateRoute>
              <SuportePage />
            </PrivateRoute>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
