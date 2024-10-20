import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SalesProcess from './components/SalesProcess';
import Analytics from './components/Analytics';
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><ProductList /></PrivateRoute>} />
              <Route path="/add-product" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
              <Route path="/edit-product/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
              <Route path="/sales" element={<PrivateRoute><SalesProcess /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;