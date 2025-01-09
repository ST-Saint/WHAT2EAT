'use client';

import ReviewTable from './ReviewTable';
import NavigationBar from '@/app/NavigationBar';

const Page = () => {
    return (
        <>
            <NavigationBar />
            <div className='flex flex-col items-center m-1 h-[90vh] min-w-[60%] lg:max-w-[60%] mx-auto space-y-[8vh] p-1'>
                <ReviewTable />
            </div>
        </>
    );
};

export default Page;
