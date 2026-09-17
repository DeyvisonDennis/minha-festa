'use client';

import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  timestamp: string;
};

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => {
        if (!res.ok) throw new Error('Falha na requisição');
        return res.json();
      })
      .then((data: HealthResponse) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Minha Festa</h1>

      {error && <p className="text-red-500">Erro: {error}</p>}

      {health ? (
        <div className="text-center">
          <p className="text-green-600 font-medium">
            Backend conectado ✅
          </p>
          <p className="text-sm text-gray-500">
            Status: {health.status}
          </p>
          <p className="text-sm text-gray-500">
            Timestamp: {health.timestamp}
          </p>
        </div>
      ) : (
        !error && <p>Conectando ao backend...</p>
      )}
    </main>
  );
}