import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const customerAPI = {
    getAll:  () => axios.get(`${BASE_URL}/customers`),
    getOne:  (id) => axios.get(`${BASE_URL}/customers/${id}`),
    add:     (data) => axios.post(`${BASE_URL}/customers`, data),
    delete:  (id) => axios.delete(`${BASE_URL}/customers/${id}`)
};

export const accountAPI = {
    getAll:         () => axios.get(`${BASE_URL}/accounts`),
    getByCustomer:  (id) => axios.get(`${BASE_URL}/accounts/customer/${id}`),
    open:           (data) => axios.post(`${BASE_URL}/accounts`, data),
    updateStatus:   (id, status) => axios.patch(`${BASE_URL}/accounts/${id}/status`, { status })
};

export const transactionAPI = {
    getAll:      () => axios.get(`${BASE_URL}/transactions`),
    getByAccount:(id) => axios.get(`${BASE_URL}/transactions/account/${id}`),
    deposit:     (data) => axios.post(`${BASE_URL}/transactions/deposit`, data),
    withdraw:    (data) => axios.post(`${BASE_URL}/transactions/withdraw`, data),
    transfer:    (data) => axios.post(`${BASE_URL}/transactions/transfer`, data)
};

export const auditAPI = {
    getAll:     () => axios.get(`${BASE_URL}/auditlog`),
    getByTable: (tableName) => axios.get(`${BASE_URL}/auditlog/table/${tableName}`)
};