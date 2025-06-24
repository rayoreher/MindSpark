import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Upload } from "../pages/Upload";
import { Login } from "../pages/Login";
import { Quiz } from "../pages/Quiz";
import { Buckets, BucketCreate, BucketDetails } from "../pages/Buckets";
import { ProtectedRoute } from "../components/auth";
import { MainLayout } from "../layouts/MainLayout";

const routes = {
  public: [
    { path: "login", element: <Login /> },
  ],
  protected: [
    { path: "buckets", element: <Buckets /> },
    { path: "buckets/:id", element: <BucketDetails /> },
    { path: "buckets/:id/upload", element: <Upload /> },
    { path: "buckets/:id/questions/:questionId", element: <Quiz /> },
    { path: "buckets/create", element: <BucketCreate /> },
  ],
};

export const AppRouter = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            {routes.public.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
            {routes.protected.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
        </Routes>
    </Router>
  );
};