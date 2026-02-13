import Image from 'next/image';
import Link from 'next/link';
const Logo = () => (
    <div className="flex items-center space-x-4">
        <Link href="/">
            <Image src="/logo.svg" alt="App Logo" width={48} height={48} className="w-12 h-12" />
        </Link>
    </div>
);

export default Logo;