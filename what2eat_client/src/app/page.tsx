'use client';

import Image from 'next/image';
import logo from './WHAT2EAT.png';
import NavigationBar from './NavigationBar';
import * as React from 'react';

export default function Home() {
    return (
        <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center h-screen w-screen font-[family-name:var(--font-geist-sans)]'>
            <NavigationBar />
            <header className='max-h-[90vh] flex flex-col p-8 items-center justify-center text-[calc(10px+2vmin)]'>
                <img
                    className='h-[60vh] pointer-events-none motion-safe:animate-logo-spin'
                    src='./WHAT2EAT.png'
                    alt='logo'
                />
                <p>
                    In the pursuit of what to eat, we are
                    also seeking deeper meanings.
                </p>
            </header>
        </div>
    );
}
