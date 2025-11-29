"use client";
import React from 'react';
import SignInForm from '@/components/auth/SignInForm';

const Page = () => {
    return (
        <div className='flex items-center w-screen h-screen justify-center bg-gray-50 dark:bg-gray-900'>
            <div className='w-full max-w-md'>
                <SignInForm />
            </div>
        </div>
    );
}

export default Page