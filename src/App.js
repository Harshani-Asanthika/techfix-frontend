import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your components for Authentication
import Login from '../src/Components/Auth/Login';
import Register from '../src/Components/Auth/Register';

// Import your components for Inventory Service
import ProductList from '../src/Components/Inventory/ProductList';
import AddComponentForm from '../src/Components/Inventory/AddComponentForm';
import ComponentDetail from '../src/Components/Inventory/ComponentDetail';
import EditComponentForm from '../src/Components/Inventory/EditComponentForm';

// Import your components for Quotation Service
import QuotationList from '../src/Components/Quotation/QuotationList';
import AddQuotationForm from '../src/Components/Quotation/AddQuotationForm';
import QuotationDetail from '../src/Components/Quotation/QuotationDetail';
import EditQuotationForm from '../src/Components/Quotation/EditQuotationForm';

// Import your components for Order Service (UPDATED IMPORTS)
import OrderList from '../src/Components/Order/OrderList';
import AddOrderForm from '../src/Components/Order/AddOrderForm';
// You will add OrderDetail, EditOrderForm imports here later when created


// A simple placeholder for a true dashboard home
const DashboardHome = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome to the TechFix Dashboard!</h2>
        <p>Navigate using the links in the sidebar.</p>
        <p>Explore your inventory, manage quotations, or add new components.</p>
    </div>
);

// Simple 404 Not Found component
const NotFound = () => (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" style={linkStyle}>Go to Dashboard Home</Link>
    </div>
);

function App() {
    return (
        <Router>
            <div style={appContainerStyle}>
                {/* Header */}
                <header style={headerStyle}>
                    <h1 style={{ margin: 0, color: 'white' }}>TechFix Management System</h1>
                    {/* Optional: User info or logout button here */}
                </header>

                {/* Main Content Area */}
                <div style={mainContentAreaStyle}>
                    {/* Sidebar Navigation */}
                    <nav style={sidebarStyle}>
                        <ul style={navListStyle}>
                            <li style={navItemStyle}>
                                <Link to="/" style={linkStyle}>Dashboard Home</Link>
                            </li>
                            <li style={navItemStyle}>
                                <Link to="/inventory" style={linkStyle}>Inventory List</Link>
                            </li>
                            <li style={navItemStyle}>
                                <Link to="/add-component" style={linkStyle}>Add Component</Link>
                            </li>
                            <li style={navItemStyle}>
                                <Link to="/quotations" style={linkStyle}>Quotations List</Link>
                            </li>
                            <li style={navItemStyle}>
                                <Link to="/add-quotation" style={linkStyle}>Add Quotation</Link>
                            </li>
                            {/* Order Service Links */}
                            <li style={navItemStyle}>
                                <Link to="/orders" style={linkStyle}>Orders List</Link>
                            </li>
                            <li style={navItemStyle}>
                                <Link to="/add-order" style={linkStyle}>Add Order</Link>
                            </li>
                            {/* End Order Service Links */}
                            <li style={navItemStyle}>
                                <Link to="/login" style={linkStyle}>Login</Link>
                            </li >
                            <li style={navItemStyle}>
                                <Link to="/register" style={linkStyle}>Register</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Content Display Area */}
                    <main style={contentAreaStyle}>
                        <Routes>
                            {/* Default route for the dashboard home */}
                            <Route path="/" element={<DashboardHome />} />

                            {/* Routes for Inventory Components */}
                            <Route path="/inventory" element={<ProductList />} />
                            <Route path="/add-component" element={<AddComponentForm />} />
                            <Route path="/inventory/:id" element={<ComponentDetail />} />
                            <Route path="/inventory/edit/:id" element={<EditComponentForm />} />

                            {/* Routes for Quotation Components */}
                            <Route path="/quotations" element={<QuotationList />} />
                            <Route path="/add-quotation" element={<AddQuotationForm />} />
                            <Route path="/quotations/:id" element={<QuotationDetail />} />
                            <Route path="/quotations/edit/:id" element={<EditQuotationForm />} />

                            {/* Routes for Order Components */}
                            <Route path="/orders" element={<OrderList />} />
                            <Route path="/add-order" element={<AddOrderForm />} />
                            {/* You will add OrderDetail, EditOrderForm routes here later */}

                            {/* Routes for Authentication */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Fallback for unmatched routes */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

// --- Inline Styles for Dashboard Layout ---
const appContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
};

const headerStyle = {
    backgroundColor: '#343a40',
    padding: '20px',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const mainContentAreaStyle = {
    display: 'flex',
    flexGrow: 1,
};

const sidebarStyle = {
    width: '220px',
    backgroundColor: '#ffffff',
    padding: '20px 0',
    boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
    borderRight: '1px solid #eee',
    flexShrink: 0,
};

const navListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const navItemStyle = {
    marginBottom: '5px',
};

const linkStyle = {
    display: 'block',
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#343a40',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease, color 0.2s ease',
};

const contentAreaStyle = {
    flexGrow: 1,
    padding: '20px',
    backgroundColor: '#ffffff',
    margin: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
};

export default App;