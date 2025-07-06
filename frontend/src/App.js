import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import ProductList from './components/ProductList';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './components/ProductDetail';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/products"
                    element={<ProtectedRoute><ProductList /></ProtectedRoute>}
                />

                {}
                <Route
                    path="/products/:id"
                    element={<ProtectedRoute><ProductDetail /></ProtectedRoute>}
                />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;