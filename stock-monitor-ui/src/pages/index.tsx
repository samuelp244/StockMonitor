import Image from "next/image";
import { Inter } from "next/font/google";
import UserLogin from "@/components/auth/login";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <div className='overflow-hidden rounded-lg border bg-background shadow-md w-full max-w-lg'>
        <UserLogin />
      </div>
    </main>
  );
}
