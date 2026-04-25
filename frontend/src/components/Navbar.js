import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'nav-link active fw-bold' : 'nav-link';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1a3c5e' }}>
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4" to="/">
                    🏦 CBS Banking
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navMenu">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className={isActive('/')} to="/">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={isActive('/customers')} to="/customers">Customers</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={isActive('/accounts')} to="/accounts">Accounts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={isActive('/transactions')} to="/transactions">Transactions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={isActive('/auditlog')} to="/auditlog">Audit Log</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;