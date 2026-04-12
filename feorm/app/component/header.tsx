'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AUTH_CHANGE_EVENT, clearAccessToken, getAccessToken } from '../lib/auth';

export default function Header() {
    const [hasToken, setHasToken] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [productOpen, setProductOpen] = useState(false);

    useEffect(() => {
        const sync = () => setHasToken(Boolean(getAccessToken()));
        sync();

        const onStorage = (e: StorageEvent) => {
            if (e.key === 'accessToken') sync();
        };
        const onAuthChange = () => sync();

        window.addEventListener('storage', onStorage);
        window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
        };
    }, []);

    return (
        <header className="bg-gray-900 text-white">
            <nav
                aria-label="Global"
                className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
            >
                <div className="flex items-center gap-4 lg:flex-1">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="inline-flex size-8 items-center justify-center rounded bg-indigo-600 text-white">
                            FE
                        </span>
                        ORM
                    </Link>

                    <div className="hidden items-center gap-6 lg:flex">
                        <Link href="/" className="text-sm font-semibold text-white hover:text-white/80">
                            Home
                        </Link>

                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80"
                                aria-expanded={productOpen}
                                aria-haspopup="menu"
                                onClick={() => setProductOpen((v) => !v)}
                            >
                                Product
                                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                                    <path
                                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {productOpen ? (
                                <div
                                    role="menu"
                                    className="absolute left-0 z-20 mt-2 w-56 rounded-lg bg-gray-800 p-2 shadow-lg ring-1 ring-white/10"
                                >
                                    <Link
                                        href="/"
                                        role="menuitem"
                                        className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                                        onClick={() => setProductOpen(false)}
                                    >
                                        Images
                                    </Link>
                                    <Link
                                        href="/images/created"
                                        role="menuitem"
                                        className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                                        onClick={() => setProductOpen(false)}
                                    >
                                        My Created
                                    </Link>
                                    <Link
                                        href="/auth"
                                        role="menuitem"
                                        className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                                        onClick={() => setProductOpen(false)}
                                    >
                                        Auth
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-white/10"
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(true)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {hasToken ? (
                        <button
                            className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/15"
                            onClick={() => {
                                clearAccessToken();
                            }}
                            type="button"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/auth" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold hover:bg-indigo-500">
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            {mobileOpen ? (
                <div className="lg:hidden">
                    <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-gray-900 p-6 shadow-xl ring-1 ring-white/10">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="font-semibold" onClick={() => setMobileOpen(false)}>
                                feOrm
                            </Link>
                            <button
                                type="button"
                                className="rounded-md p-2 text-gray-200 hover:bg-white/10"
                                aria-label="Close menu"
                                onClick={() => setMobileOpen(false)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                                    <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-6 space-y-2">
                            <Link href="/" className="block rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                                Home
                            </Link>
                            <Link href="/images/created" className="block rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                                My Created
                            </Link>
                            <Link href="/auth" className="block rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                                Auth
                            </Link>

                            {hasToken ? (
                                <button
                                    className="mt-4 w-full rounded-md bg-white/10 px-3 py-2 text-left text-base font-semibold hover:bg-white/15"
                                    onClick={() => {
                                        clearAccessToken();
                                        setMobileOpen(false);
                                    }}
                                    type="button"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link href="/auth" className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold hover:bg-indigo-500" onClick={() => setMobileOpen(false)}>
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </header>
    );
}
