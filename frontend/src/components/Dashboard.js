import React, { useEffect, useState } from 'react';
import { customerAPI, accountAPI, transactionAPI, auditAPI } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        customers: 0, accounts: 0, transactions: 0, logs: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [c, a, t, l] = await Promise.all([
                    customerAPI.getAll(),
                    accountAPI.getAll(),
                    transactionAPI.getAll(),
                    auditAPI.getAll()
                ]);
                setStats({
                    customers:    c.data.data.length,
                    accounts:     a.data.data.length,
                    transactions: t.data.data.length,
                    logs:         l.data.data.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Customers',    value: stats.customers,    icon: '👤', color: '#1a3c5e' },
        { title: 'Total Accounts',     value: stats.accounts,     icon: '🏦', color: '#28a745' },
        { title: 'Total Transactions', value: stats.transactions, icon: '💸', color: '#ffc107' },
        { title: 'Audit Logs',         value: stats.logs,         icon: '📋', color: '#dc3545' }
    ];

    return (
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold">📊 Dashboard</h2>
            <div className="row g-4">
                {cards.map((card, i) => (
                    <div className="col-md-3" key={i}>
                        <div className="card shadow text-white h-100"
                            style={{ backgroundColor: card.color, borderRadius: '12px' }}>
                            <div className="card-body text-center">
                                <div style={{ fontSize: '2.5rem' }}>{card.icon}</div>
                                <h5 className="card-title mt-2">{card.title}</h5>
                                <h2 className="fw-bold">{card.value}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;