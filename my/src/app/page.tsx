'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import Heading from './(marketing)/Heading';

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
    <div className="w-[100vw] h-[100vh] ">
      <Heading />

      <Link
        href="/login"
        className="border border-black py-2 px-10 rounded-full ml-10"
      >
        login
      </Link>

      <Link
        href="/signup"
        className="border border-black py-2 px-10 rounded-full ml-10"
      >
        join
      </Link>
    </div>
  );
}
