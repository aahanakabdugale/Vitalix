// src/components/LogoutButton.tsx
'use client';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}