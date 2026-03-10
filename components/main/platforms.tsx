import { Button } from "../ui/button";


export default function Platforms() {
    // Smooth scroll to top handler
    const handleBegin = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
        <div className="">
            <div className="flex flex-col items-center">
                <h2 className="text-lg font-bold bg-primary text-white rounded-3xl px-4 py-2">Supported Platforms</h2>
                <p className="text-muted-foreground text-center mt-1">
                    We support a variety of video platforms for transcription.
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                {/* Write-up container */}
                <div className="bg-background rounded-2xl shadow-md hover:shadow-lg p-6 w-full md:w-1/2 flex flex-col items-start gap-8">
                    <h2 className="text-[35px] font-bold text-primary">Effortless Video Transcription</h2>
                    <p className="text-gray-700">Paste your video link and instantly transcribe, edit, and copy your content. Save time and boost productivity with seamless transcript generation.</p>
                    <Button
                        className="bg-primary border-blue-200 py-6 rounded-3xl text-white font-medium hover:bg-primary/80 w-full md:max-w-[150px]"
                        type="button"
                        onClick={handleBegin}
                    >
                        Start Transcribing
                    </Button>
                </div>
                {/* Platform logos container */}
                <div className="bg-background rounded-2xl shadow-md hover:shadow-lg p-6 w-full md:w-1/2 flex flex-col items-center gap-8 ">
                    <h3 className="text-[40px] font-semibold text-primary">Platforms</h3>
                    <div className="flex gap-8 items-center justify-center">
                        <span className="flex flex-col items-center">
                            <img src="/tiktok.svg" alt="TikTok" className="w-14 h-14" />
                            <span className="mt-2 text-xs text-gray-600">TikTok</span>
                        </span>
                        <span className="flex flex-col items-center">
                            <img src="/instagram.svg" alt="Instagram Reels" className="w-16 h-16" />
                            <span className="mt-2 text-xs text-gray-600">Instagram Reels</span>
                        </span>
                        <span className="flex flex-col items-center">
                            <img src="/youtube.svg" alt="YouTube Shorts" className="w-16 h-16" />
                            <span className="mt-2 text-xs text-gray-600">YouTube Shorts</span>
                        </span>
                    </div>
                    <p className="mt-4 text-md text-gray-600 text-center">Paste a link from a supported    platform to get started with your video transcription.</p>
                </div>
            </div>
        </div>
    );
}
