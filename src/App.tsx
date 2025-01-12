import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import TaskDetails from 'views/paktyping/TaskDetails';
import useAuthStore from 'constants/useAuthStore';
import SignIn from 'views/auth/signIn';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { isAuthenticated } = useAuthStore();

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Public Route for Sign-In */}
        <Route
          path="auth/sign-in"
          element={
            isAuthenticated ? <Navigate to="/admin" replace /> : <SignIn />
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="admin/*"
          element={
            isAuthenticated ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        >
          {/* Nested Route for Task Details */}
          <Route path="task-detail/:id" element={<TaskDetails />} />
        </Route>

        {/* Catch-All Redirect */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? '/admin' : '/auth/sign-in'}
              replace
            />
          }
        />
      </Routes>
    </ChakraProvider>
  );
}
