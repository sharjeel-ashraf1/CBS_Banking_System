import React, { useEffect, useState } from 'react';
import { transactionAPI } from '../services/api';
import { toast } from 'react-toastify';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('deposit');
    const [form, setForm] = useState({ accountId: '', amount: '', fromAccount: '', toAccount: '' });

    const fetchTransactions = async () => {
        try {
            const res = await transactionAPI.getAll();
            setTransactions(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch transactions');
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
            await transactionAPI.deposit({ accountId: Number(form.accountId), amount: Number(form.amount) });
            toast.success('Deposit successful!');
            setForm({ accountId: '', amount: '', fromAccount: '', toAccount: '' });
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deposit failed');
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            await transactionAPI.withdraw({ accountId: Number(form.accountId), amount: Number(form.amount) });
            toast.success('Withdrawal successful!');
            setForm({ accountId: '', amount: '', fromAccount: '', toAccount: '' });
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed');
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await transactionAPI.transfer({
                fromAccount: Number(form.fromAccount),
                toAccount:   Number(form.toAccount),
                amount:      Number(form.amount)
            });
            toast.success('Transfer successful!');
            setForm({ accountId: '', amount: '', fromAccount: '', toAccount: '' });
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Transfer failed');
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="fw-bold mb-4">💸 Transaction Management</h3>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                {['deposit', 'withdraw', 'transfer'].map(tab => (
                    <li className="nav-item" key={tab}>
                        <button className={`nav-link ${activeTab === tab ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Deposit Form */}
            {activeTab === 'deposit' && (
                <div className="card shadow mb-4">
                    <div className="card-header fw-bold bg-success text-white">Deposit</div>
                    <div className="card-body">
                        <form onSubmit={handleDeposit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input className="form-control" type="number" placeholder="Account ID" required
                                        value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="number" placeholder="Amount" required
                                        value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                                </div>
                            </div>
                            <button className="btn btn-success mt-3" type="submit">Deposit</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Form */}
            {activeTab === 'withdraw' && (
                <div className="card shadow mb-4">
                    <div className="card-header fw-bold bg-warning text-dark">Withdraw</div>
                    <div className="card-body">
                        <form onSubmit={handleWithdraw}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input className="form-control" type="number" placeholder="Account ID" required
                                        value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="number" placeholder="Amount" required
                                        value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                                </div>
                            </div>
                            <button className="btn btn-warning mt-3" type="submit">Withdraw</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Transfer Form */}
            {activeTab === 'transfer' && (
                <div className="card shadow mb-4">
                    <div className="card-header fw-bold bg-primary text-white">Transfer</div>
                    <div className="card-body">
                        <form onSubmit={handleTransfer}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <input className="form-control" type="number" placeholder="From Account ID" required
                                        value={form.fromAccount} onChange={e => setForm({ ...form, fromAccount: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <input className="form-control" type="number" placeholder="To Account ID" required
                                        value={form.toAccount} onChange={e => setForm({ ...form, toAccount: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <input className="form-control" type="number" placeholder="Amount" required
                                        value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                                </div>
                            </div>
                            <button className="btn btn-primary mt-3" type="submit">Transfer</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="card shadow">
                <div className="card-header fw-bold" style={{ backgroundColor: '#ffc107' }}>
                    Transaction History
                </div>
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th><th>Type</th><th>From</th>
                                <th>To</th><th>Amount</th><th>Status</th><th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr><td colSpan="7" className="text-center">No transactions found</td></tr>
                            ) : transactions.map(t => (
                                <tr key={t.TRANSACTIONID}>
                                    <td>{t.TRANSACTIONID}</td>
                                    <td><span className="badge bg-info text-dark">{t.TYPE}</span></td>
                                    <td>{t.FROMACCOUNT || '—'}</td>
                                    <td>{t.TOACCOUNT || '—'}</td>
                                    <td>PKR {Number(t.AMOUNT).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${t.STATUS === 'Success' ? 'bg-success' : t.STATUS === 'Failed' ? 'bg-danger' : 'bg-warning'}`}>
                                            {t.STATUS}
                                        </span>
                                    </td>
                                    <td>{new Date(t.DATETIME).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;