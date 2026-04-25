import React, { useEffect, useState } from 'react';
import { accountAPI, customerAPI } from '../services/api';
import { toast } from 'react-toastify';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ customerId: '', type: 'Saving', balance: '' });

    const fetchAll = async () => {
        try {
            const [a, c] = await Promise.all([accountAPI.getAll(), customerAPI.getAll()]);
            setAccounts(a.data.data);
            setCustomers(c.data.data);
        } catch (err) {
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await accountAPI.open(form);
            toast.success('Account opened successfully!');
            setForm({ customerId: '', type: 'Saving', balance: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error opening account');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await accountAPI.updateStatus(id, status);
            toast.success('Status updated!');
            fetchAll();
        } catch (err) {
            toast.error('Error updating status');
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="fw-bold mb-4">🏦 Account Management</h3>

            {/* Open Account Form */}
            <div className="card shadow mb-4">
                <div className="card-header fw-bold" style={{ backgroundColor: '#28a745', color: 'white' }}>
                    Open New Account
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <select className="form-select" required
                                    value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })}>
                                    <option value="">Select Customer</option>
                                    {customers.map(c => (
                                        <option key={c.CUSTOMERID} value={c.CUSTOMERID}>{c.NAME}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select className="form-select"
                                    value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option>Saving</option>
                                    <option>Current</option>
                                    <option>Loan</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <input className="form-control" type="number" placeholder="Initial Balance"
                                    value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} required />
                            </div>
                        </div>
                        <button className="btn mt-3 text-white" style={{ backgroundColor: '#28a745' }} type="submit">
                            + Open Account
                        </button>
                    </form>
                </div>
            </div>

            {/* Accounts Table */}
            <div className="card shadow">
                <div className="card-header fw-bold" style={{ backgroundColor: '#28a745', color: 'white' }}>
                    All Accounts
                </div>
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Account ID</th><th>Customer</th><th>Type</th>
                                <th>Balance</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length === 0 ? (
                                <tr><td colSpan="6" className="text-center">No accounts found</td></tr>
                            ) : accounts.map(a => (
                                <tr key={a.ACCOUNTID}>
                                    <td>{a.ACCOUNTID}</td>
                                    <td>{a.CUSTOMERNAME}</td>
                                    <td><span className="badge bg-primary">{a.TYPE}</span></td>
                                    <td>PKR {Number(a.BALANCE).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${a.STATUS === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                            {a.STATUS}
                                        </span>
                                    </td>
                                    <td>
                                        {a.STATUS === 'Active' ? (
                                            <button className="btn btn-warning btn-sm"
                                                onClick={() => handleStatusChange(a.ACCOUNTID, 'Inactive')}>
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button className="btn btn-success btn-sm"
                                                onClick={() => handleStatusChange(a.ACCOUNTID, 'Active')}>
                                                Activate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Accounts;