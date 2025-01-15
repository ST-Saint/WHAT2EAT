'use client';

import Image from 'next/image';
import NavigationBar from './NavigationBar';
import * as React from 'react';

export default function Home() {
    return (
        <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center h-screen w-screen'>
            <NavigationBar />
            <header className='max-h-[90vh] flex flex-col p-8 items-center justify-center text-[calc(10px+2vmin)]'>
                <Image
                    className='h-[60vh] pointer-events-none motion-safe:animate-logo-spin'
                    src='/w2e/WHAT2EAT.png'
                    alt='logo'
                    width={500}
                    height={500}
                />
                <p>
                    In the pursuit of{' '}
                    <span className='text-primary'>
                        what to eat
                    </span>
                    , we are seeking deeper meanings.
                </p>
            </header>
        </div>
    );
}
