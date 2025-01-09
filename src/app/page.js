'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MyPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Ensure the code runs only on the client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");

      if (token) {
        // Redirect to newsfeed page if token exists
        router.push("/pages/newsfeed");
      } else {
        // Redirect to sign-in page if token does not exist
        router.push("/auth/sign-in");
      }
    }
  }, [router]); // Dependency on router to avoid stale references

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default MyPage;
