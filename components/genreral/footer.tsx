import Logo from "./logo";
export default function Footer() {
    return (
        <footer className="w-full bg-gray-600 text-white py-8 px-4 ">
            <div className="w-full px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <Logo />
                <nav className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm items-center">
                    <a
                        href="#"
                        className="hover:underline hover:text-blue-200"
                    >
                        About
                    </a>
                    <a
                        href="#"
                        className="hover:underline hover:text-blue-200"
                    >
                        Contact
                    </a>
                    <a
                        href="#"
                        className="hover:underline hover:text-blue-200"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="hover:underline hover:text-blue-200"
                    >
                        Terms of Service
                    </a>
                </nav>
                <div className="text-lg text-blue-100 text-center md:text-right">
                    &copy; {new Date().getFullYear()} Clip Script. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
}

