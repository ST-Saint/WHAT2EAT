'use client';

import React, { useEffect, useState } from 'react';

import DiningEditor from './DiningEditor';
import DishEditor from './DishEditor';
import NavigationBar from '@/app/NavigationBar';

const Dining = () => {
    const [dining, setDining] = useState('');
    return (
        <>
            <NavigationBar />
            <div className='flex flex-col items-center mt-[2em] h-[90vh] min-w-[50%] lg:max-w-[50%] mx-auto space-y-[10vh]'>
                <DiningEditor
                    setDining={setDining}
                />
            <DishEditor dining={dining} />
            </div>
        </>
    );
};

export default Dining;