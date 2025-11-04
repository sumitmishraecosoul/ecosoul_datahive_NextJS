'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RetailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect old route to new overview route
    router.replace('/dashboard/retail/overview');
  }, [router]);

  return null;
}