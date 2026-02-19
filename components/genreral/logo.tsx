import Image from 'next/image';
import Link from 'next/link';
const Logo = () => (
    <div className="flex items-center space-x-4">
        <Link href="/" className='flex items-center gap-3'>
            <Image src="/logo.svg" alt="App Logo" width={48} height={48} className="w-12 h-12" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary via-[#25F4EE] to-[#E1306C] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(37,244,238,0.18)]">
                Transcripto
            </span>
        </Link>
    </div>
);

export default Logo;