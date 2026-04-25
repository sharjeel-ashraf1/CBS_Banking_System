import React, { useEffect, useState } from 'react';
import { auditAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('All');

    const fetchLogs = async () => {
        try {
            const res = filter === 'All'
                ? await auditAPI.getAll()
                : await auditAPI.getByTable(filter);
            setLogs(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch audit logs');
        }
    };

    useEffect(() => { fetchLogs(); }, [filter]);

    return (
        <div className="container mt-4">
            <h3 className="fw-bold mb-4">📋 Audit Log</h3>

            {/* Filter */}
            <div className="mb-4">
                {['All', 'Customer', 'Account', 'Transaction_Tbl'].map(f => (
                    <button key={f}
                        className={`btn me-2 ${filter === f ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setFilter(f)}>
                        {f === 'Transaction_Tbl' ? 'Transaction' : f}
                    </button>
                ))}
            </div>

            {/* Logs Table */}
            <div className="card shadow">
                <div className="card-header fw-bold bg-danger text-white">
                    System Audit Logs {filter !== 'All' && `— ${filter}`}
                </div>
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Log ID</th><th>Operation</th><th>Table</th>
                                <th>Record ID</th><th>User</th><th>Details</th><th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr><td colSpan="7" className="text-center">No logs found</td></tr>
                            ) : logs.map(l => (
                                <tr key={l.LOGID}>
                                    <td>{l.LOGID}</td>
                                    <td>
                                        <span className={`badge ${
                                            l.OPERATION === 'INSERT' ? 'bg-success' :
                                            l.OPERATION === 'UPDATE' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                            {l.OPERATION}
                                        </span>
                                    </td>
                                    <td>{l.TABLEAFFECTED}</td>
                                    <td>{l.RECORDID}</td>
                                    <td>{l.ACTIONUSER}</td>
                                    <td>{l.DETAILS}</td>
                                    <td>{new Date(l.DATETIME).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLog;