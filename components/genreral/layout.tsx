import { useState } from "react"
import { NavigationBar } from "../ui/NavigationIndex"
import TranscribedChats from "./transcribedChats"
import { Menu } from "lucide-react"
import Footer from "./footer"

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar: TranscribedChats for mobile and desktop */}
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div
                className={`fixed left-0 top-0 h-full z-40 transition-all duration-300
                    ${sidebarOpen ? 'block' : 'hidden'}
                    w-64 sm:w-80 max-w-full
                    bg-white
                    sm:bg-transparent
                    sm:block
                `}
            >
                <TranscribedChats open={sidebarOpen} setOpen={setSidebarOpen} />
            </div>

            {/* Main content area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300
                    ${sidebarOpen ? 'sm:ml-80' : 'sm:ml-0'}
                    max-w-full
                    ${sidebarOpen ? 'overflow-hidden' : ''}
                `}
            >
                {/* Fixed Top NavigationBar */}
                <header
                    className={`fixed top-0 left-0 ${sidebarOpen ? 'sm:ml-80' : 'sm:ml-0'} right-0 z-20 transition-all duration-300 max-w-full px-4 sm:px-6 lg:px-8`}
                >
                    <NavigationBar isOpen={sidebarOpen} onOpen={() => setSidebarOpen((p) => !p)} />
                </header>
                {/* Main content below NavigationBar */}
                <main
                    className="min-h-[calc(100vh-5rem)] pt-30 px-4 sm:px-6 lg:px-8 w-full max-w-full"
                >
                    {children}
                </main>
                <footer className="w-full max-w-full">
                    <Footer />
                </footer>
            </div>
        </div>
    )
}
