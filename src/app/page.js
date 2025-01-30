'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MyPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push("/pages/newsfeed");
    }
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default MyPage;
