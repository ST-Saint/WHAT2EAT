'use client';

import * as React from 'react';

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from '@nextui-org/react';

import { usePathname } from 'next/navigation';

const pages: string[] = [
    'Home',
    'Reviews',
    'Dining',
    'Edits',
];

const ref: string[] = [
    '/',
    '/reviews',
    '/dining',
    '/edits',
];

function NavigationBar() {
    const [isMenuOpen] =
        React.useState(false);

    const pageIdx = ref.indexOf(usePathname());
    const selPage = pageIdx > 0 ? pages[pageIdx] : 'Home';
    return (
        <Navbar className='w-full flex flex-row items-center h-[10vh]'>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={
                        isMenuOpen
                            ? 'Close menu'
                            : 'Open menu'
                    }
                    className='sm:hidden'
                />
                <NavbarBrand>
                    <p className='font-bold text-2xl'>
                        W2E
                    </p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className='hidden sm:flex gap-4 min-w-1/2'>
                {pages.map((page, index) => (
                    <NavbarItem
                        isActive={page == selPage}
                        key={page}
                    >
                        <Link
                            href={ref[index]}
                            color={
                                page == selPage
                                    ? 'primary'
                                    : 'foreground'
                            }
                            className='text-xl'
                        >
                            {page}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarMenu>
                {pages.map((page, index) => (
                    <NavbarMenuItem
                        key={`${page}-${index}`}
                    >
                        <Link
                            className='w-full'
                            href={ref[index]}
                            color={
                                page == selPage
                                    ? 'primary'
                                    : 'foreground'
                            }
                            size='lg'
                        >
                            {page}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
            <NavbarContent justify='end'>
                <NavbarItem className='lg:flex'>
                    <Link href='#'>Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        as={Link}
                        color='primary'
                        href='#'
                        variant='flat'
                    >
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default NavigationBar;
