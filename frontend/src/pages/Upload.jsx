import React, { useCallback, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';
import { useApi } from '../lib/api.js';

export default function Upload() {
  const { token } = useAuth();
  const { client } = useApi();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setStatus('Uploading...');
    const form = new FormData();
    form.append('file', file);
    // Use axios to handle auth and baseURL; track progress
    const res = await client.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      },
    });
    if (res.status >= 200 && res.status < 300) setStatus('Uploaded');
    else setStatus('Upload failed');
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upload</h2>
        {file ? (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">{file.name}</span>
        ) : null}
      </div>
      <Card className="mb-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) setFile(f);
          }}
          className="mb-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-gray-300 p-10 text-center text-gray-600 hover:bg-gray-50"
          onClick={() => inputRef.current?.click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-gray-400">
            <path fillRule="evenodd" d="M11.47 3.84a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 1 1-1.06 1.06l-2.47-2.47V15a.75.75 0 0 1-1.5 0V6.18L8.78 8.65a.75.75 0 1 1-1.06-1.06l3.75-3.75Z" clipRule="evenodd" />
            <path d="M3.75 15a3 3 0 0 1 3-3h2.25a.75.75 0 0 1 0 1.5H6.75A1.5 1.5 0 0 0 5.25 15v2.25A1.5 1.5 0 0 0 6.75 18.75h10.5a1.5 1.5 0 0 0 1.5-1.5V15a1.5 1.5 0 0 0-1.5-1.5h-2.25a.75.75 0 0 1 0-1.5h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V15Z" />
          </svg>
          <div className="text-sm">Drag & drop CSV here or click to browse</div>
          <div className="text-xs text-gray-500">Only .csv up to 10MB</div>
        </div>
        <form onSubmit={handleUpload} className="flex flex-col items-start gap-3 sm:flex-row">
          <input ref={inputRef} className="hidden" type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>Choose File</Button>
          <Button type="submit" disabled={!file}>Upload</Button>
          {progress > 0 && progress < 100 && <div className="text-sm text-gray-600">Progress: {progress}%</div>}
        </form>
        {status && <Alert variant="success" className="mt-4 w-full">{status}</Alert>}
      </Card>
    </div>
  );
}


