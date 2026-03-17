"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCaptcha } from "@/hooks/useCaptcha";
import Recaptcha from "@/components/ui/Recaptcha";
import { useTranscription } from "@/hooks/useTranscribe";
import { Switch } from "@/components/ui/switch"
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
import { Clipboard, Download, Copy } from "lucide-react";
import { copyToClipboard, downLoadFile, downLoadVideo, downloadUtterances } from "@/lib/utils";
import { SpinnerLoader } from "../genreral/common";
import { formatMs } from "@/lib/utils";
import LineLoader from "../genreral/lineLoader";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"



export default function TranscribeSection() {
    const [videoUrl, setVideoUrl] = useState("");
    const { captchaToken, onCaptchaChange } = useCaptcha();
    const { submitTranscription, loading, error, transcript } = useTranscription();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [viewMode, setViewMode] = useState<boolean>(false);

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
                    <h1 className="text-2xl font-bold text-center">Clip Script Transcript Generator</h1>
                    <p className="text-muted-foreground text-center mt-1">
                        Turn TikTok, Reels & Shorts into clean transcripts instantly.
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
                {!loading && <Recaptcha onChange={onCaptchaChange} />}
                <button
                    type="submit"
                    className="w-full md:w-1/2 bg-primary text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-primary/80 transition-colors duration-200"
                    disabled={loading || !captchaToken}
                >
                    {loading ? <div className="flex items-center justify-center gap-2"> <LineLoader /> Transcribing...</div> : "Generate Transcript"}
                </button>
                {error && <p className="text-red-500 text-sm">{toast.error(error)}</p>}
            </form>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setVideoUrl("");
            }}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle className="font-semibold">Review, Copy or Download</DialogTitle>
                        <div className="flex items-center justify-between w-full mt-2">
                            <div className="flex items-center gap-1">
                                <Switch
                                    id="viewModeToggle"
                                    checked={viewMode}
                                    onCheckedChange={() => setViewMode(!viewMode)}
                                />
                                <p>Timestamp</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {viewMode ? (
                                    <Clipboard className="w-5 h-5 text-primary cursor-pointer" onClick={() => copyToClipboard(transcript?.transcript || '')} />
                                ) : (
                                    <Clipboard
                                        className="w-5 h-5 text-primary cursor-pointer"
                                        onClick={() => {
                                            const transcribeTimestampsText = downloadUtterances(transcript?.utterances);
                                            copyToClipboard(transcribeTimestampsText!);
                                        }}
                                    />
                                )}
                                {viewMode ? (
                                    <Download
                                        className="w-5 h-5 text-primary cursor-pointer"
                                        onClick={() => {
                                            const downloadVideoFile = downloadUtterances(transcript?.utterances);
                                            downLoadFile(downloadVideoFile!);
                                        }}
                                    />
                                ) : (
                                    <Download className="w-5 h-5 text-primary cursor-pointer" onClick={() => downLoadFile(transcript?.transcript || "")} />
                                )}
                            </div>
                        </div>
                        <DialogDescription>
                            {transcript ? (
                                <>
                                    <div>
                                        <pre className={`p-4 ${!viewMode ? 'bg-primary text-white' : 'bg-transparent'} rounded max-h-[70vh] overflow-auto whitespace-pre-wrap`}>
                                            {!viewMode ? transcript?.transcript : (
                                                <>
                                                    {Array.isArray(transcript.utterances) && transcript.utterances.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {transcript.utterances.map((utt, idx) => (
                                                                <div key={idx} className="flex items-start gap-4 bg-primary border border-gray-200 text-white p-2 rounded-lg">
                                                                    <div className="flex flex-col gap-2 items-center">
                                                                        <span className=" text-red-100">
                                                                            {formatMs(utt.start)}
                                                                        </span>
                                                                        <button onClick={() => copyToClipboard(utt.text)} className="p-1 rounded hover:bg-primary/10 transition-colors duration-200">
                                                                            <Copy className="w-4 h-4 text-red-100" />
                                                                        </button>
                                                                    </div>
                                                                    <span className="">{utt.text}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">No utterances available.</span>
                                                    )}
                                                </>
                                            )}
                                        </pre>
                                    </div>
                                    <div className="flex gap-4 mt-4 justify-end">
                                        <Button
                                            variant="default"
                                            className="flex items-center gap-2 bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                                            onClick={async () => {
                                                setIsDownloading(true);
                                                await downLoadVideo(transcript?.jobId);
                                                setIsDownloading(false);
                                            }}
                                        >
                                            {isDownloading ? <SpinnerLoader /> : <><Download className="w-4 h-4" /> Download Video</>}
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