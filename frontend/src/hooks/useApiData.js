import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function useApiData(endpoint, mockData) {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`${API_BASE_URL}${endpoint}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((apiData) => {
        setData(apiData);
        setIsLive(true);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setData(mockData);
          setIsLive(false);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [endpoint]);

  return { data, setData, loading, isLive };
}

export default useApiData;