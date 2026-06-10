import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: '管理后台 - MituWorld',
  description: '网站内容管理后台',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
