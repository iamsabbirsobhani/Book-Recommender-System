import Image from 'next/image';
import Recom from '@/components/recom';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        <h1 className="font-bold text-5xl">Book Recommender System</h1>
      </div>
      <Recom />
    </main>
  );
}
