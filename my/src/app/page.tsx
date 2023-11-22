'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';

// import { useRouter } from 'next/router';

export default function Home() {
  // const router = useRouter();

  const fetchData = async () => {
    const data = await fetch('http://localhost:3333/users/hello');
    return await data.json();
  };

  useEffect(() => {
    fetchData().then((data: any) => console.log(data));
    fetchData();
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-pink-100">
      <p className=" w-[40vw] text-slate-700 text-9xl font-bold pt-20 pb-10">
        All of your projects, all in one place.
      </p>

      <Link
        href="/auth/login"
        className="border border-black py-2 px-10 rounded-full ml-10"
      >
        login
      </Link>
    </div>
  );
}
