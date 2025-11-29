"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/context/UserContext';
import axios from '@/axios';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      // If no token and not on signin page, redirect to signin
      if (!token) {
        if (pathname !== '/signin') {
          router.push('/signin');
        }
        setLoading(false);
        return;
      }

      // If token exists, verify it
      try {
        const response = await axios.get('/auth/admin/me');
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
          // If on signin page and authenticated, redirect to dashboard
          if (pathname === '/signin') {
            router.push('/dashboard');
          }
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('token');
        setUser(null);
        if (pathname !== '/signin') {
          router.push('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, setUser]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Yükleniyor...</h1>
        </div>
      </div>
    );
  }

  // If on signin page, show children (signin form)
  if (pathname === '/signin') {
    return <>{children}</>;
  }

  // If no user and not on signin page, don't render children
  if (!user) {
    return null;
  }

  // If user is not admin, redirect to signin
  if (!user.isAdmin) {
    router.push('/signin');
    return null;
  }

  return <>{children}</>;
}

