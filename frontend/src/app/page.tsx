import { redirect } from 'next/navigation';

// Redirect root (/) to /landing so the landing page is the main entry point
export default function Home() {
  redirect('/landing');
}
