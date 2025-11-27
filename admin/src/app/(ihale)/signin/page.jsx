"use client";
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    useEffect(() => {
        // Otomatik giriş yapıldığı için dashboard'a yönlendir
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <h1 className='text-2xl font-bold'>Yönlendiriliyor...</h1>
        </div>
    );
}

export default Page