import AdminShell from './AdminShell';

export const metadata = {
  title: 'Admin | Aysha Shana Design',
  robots: { index: false, follow: false },
};

export default function AdminLayout({children}) {
  return <AdminShell>{children}</AdminShell>;
}
