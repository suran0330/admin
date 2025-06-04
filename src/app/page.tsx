import { redirect } from 'next/navigation';

export default function RootPage() {
  // Server-side redirect to admin dashboard
  redirect('/admin');
}
