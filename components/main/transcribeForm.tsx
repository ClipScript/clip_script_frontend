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
import { Clipboard, Download, Copy, Mic, FileText } from "lucide-react";
import { copyToClipboard, downLoadFile, downLoadVideo, downloadFile, downloadUtterances } from "@/lib/utils";
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
import { downloadFileActions } from "@/lib/utils";
import { useDownloadProgress } from "@/hooks/useDownloadProgress";
import { showToaster, detectPlatform } from "@/lib/utils";


export default function TranscribeSection() {
    const [videoUrl, setVideoUrl] = useState("");
    const { captchaToken, onCaptchaChange } = useCaptcha();
    const { submitTranscription, loading, downloadVideo, isDownloading, transcript, status: transcribeStatus, progress: transcribeProgress } = useTranscription();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<boolean>(false)
    const [downloadJobId, setDownloadJobId] = useState<string | null>(null);
    const { progress, status } = useDownloadProgress(downloadJobId);

    useEffect(() => {
        setIsDialogOpen(transcript !== null);
    }, [transcript]);

    const handleSubmit = async () => {
        if (!detectPlatform(videoUrl)) {
            showToaster("Unsupported platform. Please enter a TikTok, Instagram Reel, or YouTube Shorts URL.", "error");
            return;
        }
        if (!captchaToken) {
            showToaster("Please complete the CAPTCHA", "warning");
            return;
        }
        await submitTranscription(videoUrl, captchaToken);
    };

    // const Actions = [
    //     {
    //         label: "Generate Transcript",
    //         icon: Mic,
    //         onClick: () => {
    //             handleSubmit();
    //             setPopoverOpen(false);
    //         }
    //     },
    //     {
    //         label: "Download Video",
    //         icon: Download,
    //         onClick: async () => {
    //             const jobId = await downloadVideo(videoUrl, captchaToken);
    //             if (jobId) {
    //                 setDownloadJobId(jobId);
    //             }

    //             setPopoverOpen(false);
    //         }
    //     }
    // ];

    return (
        <>
            <main className="space-y-4 flex flex-col justify-center items-center"  >
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
                {!loading && transcribeStatus !== "processing" && status !== "downloading" && <Recaptcha onChange={onCaptchaChange} />}
                <div className="flex flex-col items-start gap-2 w-full md:w-1/2 p-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        title={
                            loading
                                ? "Transcription in progress..."
                                : !captchaToken
                                    ? "Please complete the CAPTCHA"
                                    : !videoUrl
                                        ? "Please enter a video URL"
                                        : "Generate Transcript"
                        }
                        className="w-full bg-primary text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-primary/80 transition-colors duration-200"
                        disabled={loading || !captchaToken || isDownloading || !videoUrl || status === "downloading" || transcribeStatus === "processing"}
                    >
                        {transcribeStatus === "processing" ? (
                            <div className="flex items-center justify-center gap-2">
                                <LineLoader />
                                {`Processing... ${Math.round(transcribeProgress)}%`}
                            </div>
                        ) : loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <LineLoader />
                                Processing...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <FileText className="w-5 h-5 text-white" />
                                Generate Transcript
                            </div>
                        )}

                    </button>
                    <button
                        type="button"
                        onClick={async () => {
                            if (!detectPlatform(videoUrl)) {
                                showToaster("Unsupported platform. Please enter a TikTok, Instagram Reel, or YouTube Shorts URL.", "error");
                                return;
                            }
                            const jobId = await downloadVideo(videoUrl, captchaToken);
                            if (jobId) {
                                setDownloadJobId(jobId);
                            }
                        }}
                        title={
                            isDownloading
                                ? "Downloading in progress..."
                                : !captchaToken
                                    ? "Please complete the CAPTCHA"
                                    : !videoUrl
                                        ? "Please enter a video URL"
                                        : "Download Video"
                        }
                        className="w-full bg-destructive text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-destructive/80 transition-colors duration-200"
                        disabled={loading || !captchaToken || isDownloading || !videoUrl || status === "downloading" || transcribeStatus === "processing"}
                    >
                        {status === "downloading" ? (
                            <div className="flex items-center justify-center gap-2">
                                <LineLoader />
                                {`Downloading... ${Math.round(progress)}%`}
                            </div>
                        ) : isDownloading ? (
                            <div className="flex items-center justify-center gap-2">
                                <LineLoader />
                                Processing...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Download className="w-5 h-5 text-white" />
                                Download Video
                            </div>
                        )}

                    </button>
                </div>
            </main>
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
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Download className="w-5 h-5 text-primary cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-50 bg-primary text-white">
                                        <div className="flex flex-col gap-1">
                                            <p className="">Download as:</p>
                                            <hr className="border-t border-gray-200 my-1" />
                                            {downloadFileActions.map(({ label, icon: Icon, onClick }) => (
                                                <button
                                                    key={label}
                                                    onClick={() => {
                                                        const content = viewMode
                                                            ? downloadUtterances(transcript?.utterances)
                                                            : (transcript?.transcript?.replace(/([.?!])\s*/g, '$1\n') || "")

                                                        if (!content) return;

                                                        onClick(content);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted cursor-pointer hover:text-primary transition group"
                                                >
                                                    <Icon size={16} className="text-red-100 group-hover:text-red-400" />
                                                    <span className="text-sm">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DialogDescription>
                            {transcript ? (
                                <>
                                    <div>
                                        <pre className={`${!viewMode ? 'bg-primary text-white p-4' : 'bg-transparent'} rounded max-h-[70vh] overflow-auto whitespace-pre-wrap`}>
                                            {!viewMode ? transcript?.transcript : (
                                                <>
                                                    {Array.isArray(transcript.utterances) && transcript.utterances.length > 0 ? (
                                                        <div className="space-y-1 w-full">
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
                                </>
                            ) : "No transcript available."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}