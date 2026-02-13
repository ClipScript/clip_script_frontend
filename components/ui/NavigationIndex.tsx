"use client";
import { useRouter } from "next/navigation";
import { mainNavigation } from "@/data/constants";
import { Menu, EyeClosed, EyeIcon } from "lucide-react";
import Logo from "../genreral/logo";

export function NavigationBar({ onOpen, isOpen }: { onOpen?: () => void, isOpen?: boolean }) {
    const router = useRouter();
    return (
        <header className="border border-opacity-10 border-gray-200 bg-background/80 backdrop-blur-sm z-50 rounded-sm shadow-sm">
            <div className="flex h-16 items-center px-4 justify-between w-full">
                <div className="flex items-center space-x-4">
                    <Logo />
                </div>

                {/* <nav className="hidden md:flex items-center space-x-6">
                    {mainNavigation.map((nav, idx) => (
                        <Link href={nav.href} key={idx} className="text-sm text-[#81838C] hover:text-[#1e40af] hover:bg-gray-50 transition-colors duration-200">{nav.name}</Link>
                    ))}
                </nav> */}

                <button className="hidden md:flex items-center gap-2 cursor-pointer" onClick={onOpen} aria-label="Open sidebar" >
                    {isOpen ? <EyeClosed className="w-6 h-6 text-primary" /> : <EyeIcon className="w-6 h-6 text-primary" />}
                    <span className="underline">Recent Transcripts</span>
                </button>

                <button className="md:hidden" onClick={onOpen} aria-label="Open sidebar">
                    <Menu className="w-6 h-6 text-primary" />
                </button>
            </div>
        </header>
    );
}
