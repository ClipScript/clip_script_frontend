"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCaptcha } from "@/hooks/useCaptcha";
import Recaptcha from "@/components/ui/Recaptcha";
import { useTranscription } from "@/hooks/useTranscribe";
import { showToaster } from "@/lib/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Clipboard, Download } from "lucide-react";
import { copyToClipboard, downLoadFile } from "@/lib/utils";

export default function TranscribeSection() {
    const [videoUrl, setVideoUrl] = useState("");
    const { captchaToken, onCaptchaChange } = useCaptcha();
    const { submitTranscription, loading, error, transcript } = useTranscription();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setIsDialogOpen(transcript !== null);
    }, [transcript]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            toast.error("Please complete the CAPTCHA");
            return;
        }
        await submitTranscription(videoUrl, captchaToken);
    };

    return (
        <>
            <form className="space-y-4 flex flex-col justify-center items-center" onSubmit={handleSubmit} >
                <div>
                    <h1 className="text-2xl font-bold text-center">Video Transcript Generator</h1>
                    <p className="text-muted-foreground text-center mt-1">
                        Paste a TikTok, Instagram Reel, or YouTube Shorts link and get an instant transcript.
                    </p>
                </div>
                <Input
                    id="videoUrl"
                    name="videoUrl"
                    type="url"
                    autoComplete="off"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="border-2 border-primary focus:border-primary focus:ring-primary rounded-3xl px-4 py-8 w-full md:w-1/2 placeholder:text-primary/60 bg-transparent"
                    placeholder="Paste TikTok, Instagram Reel, or YouTube Shorts URL"
                />
                <Recaptcha onChange={onCaptchaChange} />
                <button
                    type="submit"
                    className="w-full md:w-1/2 bg-primary text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-primary/80 transition-colors duration-200"
                    disabled={loading || !captchaToken}
                >
                    {loading ? "Transcribing..." : "Generate Transcript"}
                </button>
                {error && <p className="text-red-500 text-sm">{toast.error(error)}</p>}
            </form>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setVideoUrl("");
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transcript Result</DialogTitle>
                        <DialogDescription>
                            {transcript ? (
                                <>
                                    <pre className="bg-muted text-primary font-mono p-4 rounded max-h-[70vh] overflow-auto whitespace-pre-wrap">
                                        {transcript.transcript}
                                    </pre>
                                    <div className="flex gap-4 mt-4 justify-end">
                                        <Button
                                            variant="default"
                                            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/80"
                                            onClick={() => copyToClipboard(transcript.transcript)}
                                        >
                                            <Clipboard className="w-4 h-4" /> Copy
                                        </Button>
                                        <Button
                                            variant="default"
                                            className="flex items-center gap-2 bg-[#ff3040] text-white hover:bg-[#e62a38]"
                                            onClick={() => downLoadFile(transcript.transcript)}
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </Button>
                                    </div>
                                </>
                            ) : "No transcript available."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}