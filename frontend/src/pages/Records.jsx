import React, { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useApi } from '../lib/api.js';
import { useAuth } from '../auth/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Records() {
  const { token } = useAuth();
  const { client } = useApi();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    (async () => {
      const res = await client.get('/records', { params: { page, limit, q } });
      setItems(res.data.items);
      setTotal(res.data.total);
    })();
  }, [token, page, q]);

  const pages = Math.ceil(total / limit) || 1;

  async function handleDownload() {
    const params = new URLSearchParams({ q });
    const res = await client.get(`/records/download?${params}`, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'records.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold">Records</h2>
        <div className="ml-auto flex gap-2">
          <Input className="w-64" placeholder="Search name/email" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={handleDownload}>Download CSV</Button>
        </div>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.phone}</td>
                <td className="px-4 py-2">{r.amount}</td>
                <td className="px-4 py-2">{new Date(r.created_at || r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm text-gray-600">Page {page} of {pages}</span>
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1">Prev</Button>
        <Button variant="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1">Next</Button>
      </div>
    </div>
  );
}


