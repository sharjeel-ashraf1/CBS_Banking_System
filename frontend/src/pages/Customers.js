import React, { useEffect, useState } from 'react';
import { customerAPI } from '../services/api';
import { toast } from 'react-toastify';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', cnic: '', contact: '', address: '', email: '' });
    const [loading, setLoading] = useState(false);

    const fetchCustomers = async () => {
        try {
            const res = await customerAPI.getAll();
            setCustomers(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch customers');
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await customerAPI.add(form);
            toast.success('Customer added successfully!');
            setForm({ name: '', cnic: '', contact: '', address: '', email: '' });
            fetchCustomers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error adding customer');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        try {
            await customerAPI.delete(id);
            toast.success('Customer deleted');
            fetchCustomers();
        } catch (err) {
            toast.error('Error deleting customer');
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="fw-bold mb-4">👤 Customer Management</h3>

            {/* Add Customer Form */}
            <div className="card shadow mb-4">
                <div className="card-header fw-bold" style={{ backgroundColor: '#1a3c5e', color: 'white' }}>
                    Add New Customer
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <input className="form-control" placeholder="Full Name" required
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <input className="form-control" placeholder="CNIC (e.g. 35201-1234567-1)" required
                                    value={form.cnic} onChange={e => setForm({ ...form, cnic: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <input className="form-control" placeholder="Contact" required
                                    value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Address"
                                    value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Email"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn mt-3 text-white" style={{ backgroundColor: '#1a3c5e' }}
                            type="submit" disabled={loading}>
                            {loading ? 'Adding...' : '+ Add Customer'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Customers Table */}
            <div className="card shadow">
                <div className="card-header fw-bold" style={{ backgroundColor: '#1a3c5e', color: 'white' }}>
                    All Customers
                </div>
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th><th>Name</th><th>CNIC</th>
                                <th>Contact</th><th>Email</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr><td colSpan="6" className="text-center">No customers found</td></tr>
                            ) : customers.map(c => (
                                <tr key={c.CUSTOMERID}>
                                    <td>{c.CUSTOMERID}</td>
                                    <td>{c.NAME}</td>
                                    <td>{c.CNIC}</td>
                                    <td>{c.CONTACT}</td>
                                    <td>{c.EMAIL}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(c.CUSTOMERID)}>
                                            Delete
                                        </button>
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

export default Customers;