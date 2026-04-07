import Image from 'next/image';
import Link from 'next/link';
const Logo = () => (
    <div className="flex items-center space-x-2">
        <Link href="/" className='flex items-center gap-3 cursor-pointer'>
            <Image src="/clipScript.png" alt="App Logo" width={200} height={200} className="cursor-pointer" />
            {/* <span className="font-bold text-xl bg-gradient-to-r from-primary via-[#25F4EE] to-[#E1306C] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(37,244,238,0.18)]">
                Clip Script
            </span> */}
        </Link>
    </div>
);
export default Logo;