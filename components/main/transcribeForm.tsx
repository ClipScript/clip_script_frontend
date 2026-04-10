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
import { Clipboard, Download, Copy, Link, FileText, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
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
import { User } from "lucide-react";
import { formatCount } from "@/lib/utils";
import Image from "next/image";


export default function TranscribeSection() {
    const [videoUrl, setVideoUrl] = useState("");
    const { captchaToken, onCaptchaChange } = useCaptcha();
    const { submitTranscription, loading, downloadVideo, isDownloading, transcript, showCaptcha } = useTranscription();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<boolean>(false)
    const [downloadJobId, setDownloadJobId] = useState<string | null>(null);


    useEffect(() => {
        setIsDialogOpen(transcript !== null);
    }, [transcript]);

    const handleSubmit = async () => {
        if (!detectPlatform(videoUrl)) {
            showToaster("Unsupported platform. Please enter a TikTok, Instagram Reel, or YouTube Shorts URL.", "error");
            return;
        }

        // Only require captchaToken if CAPTCHA is shown
        if (showCaptcha && !captchaToken) {
            showToaster("Please complete the CAPTCHA", "warning");
            return;
        }

        await submitTranscription(videoUrl, captchaToken);

    };

    return (
        <>
            <main
                className={
                    transcript
                        ? "space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                        : "flex justify-center items-center min-h-[60vh]"
                }
            >
                <section className={`${transcript ? "w-full md:w-1/2" : "w-full"}  bg-white/80 rounded-xl shadow p-6 border border-gray-200 flex flex-col gap-4`}>
                    <div>
                        <h1 className="text-2xl font-bold text-center">Clip Script Transcript Generator</h1>
                        <p className="text-muted-foreground mt-1 text-center">
                            Turn TikTok, Reels & Shorts into clean transcripts instantly.
                        </p>
                    </div>
                    <div className="relative w-full">
                        <Input
                            id="videoUrl"
                            name="videoUrl"
                            type="url"
                            autoComplete="off"
                            required
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="border-2 border-primary focus:border-primary focus:ring-primary rounded-3xl px-4 py-8 w-full placeholder:text-black bg-transparent pl-12"
                            placeholder="Paste TikTok, Instagram Reel, or YouTube Shorts URL"
                        />
                        <button
                            type="button"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                            title="Paste from clipboard"
                            onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    setVideoUrl(text);
                                } catch {
                                    setVideoUrl("");
                                }
                            }}
                            tabIndex={-1}
                        >
                            <Link className="w-6 h-6" />
                        </button>
                    </div>
                    {showCaptcha && !loading && (
                        <Recaptcha onChange={onCaptchaChange} />
                    )}
                    <div className="flex flex-col items-start gap-2 w-full p-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            title={
                                loading
                                    ? "Transcription in progress..."
                                    : !videoUrl
                                        ? "Please enter a video URL"
                                        : "Generate Transcript"
                            }
                            className="w-full bg-primary text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-primary/80 transition-colors duration-200"
                            disabled={loading || isDownloading || !videoUrl}
                        >
                            {loading ? (
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
                                    : !videoUrl
                                        ? "Please enter a video URL"
                                        : "Download Video"
                            }
                            className="w-full bg-destructive text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-destructive/80 transition-colors duration-200"
                            disabled={loading || isDownloading || !videoUrl}
                        >
                            {isDownloading ? (
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
                </section>
                {/* Metadata and Stats Section */}
                {transcript && (
                    <div className="w-full md:1/2 bg-white/80 rounded-xl shadow p-6 border border-gray-200 flex items-start gap-6">
                        <div className="mb-2 w-full">
                            {transcript.metadata.media.thumbnailUrl && (
                                <img
                                    src={transcript.metadata.media.thumbnailUrl}
                                    alt="Thumbnail"
                                    className="rounded-lg border border-gray-200 object-cover w-full"
                                />
                            )}
                            {/* Video player if direct video URL is available */}
                            {/* {transcript.metadata.media.videoUrl && (
                                <video
                                    src={transcript.metadata.media.videoUrl}
                                    controls
                                    className="w-full rounded-lg mt-4 max-h-80"
                                    poster={transcript.metadata.media.thumbnailUrl}
                                />
                            )} */}
                        </div>
                        <section className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                {transcript.metadata.author.avatarUrl && (
                                    <img
                                        src={transcript.metadata.author.avatarUrl}
                                        alt="Avatar"
                                        className="rounded-full border border-gray-300 object-cover w-14 h-14"
                                    />
                                )}
                                <div>
                                    <div className="font-semibold text-base">{transcript.metadata.author.displayName}</div>
                                    <div className="text-sm text-gray-500">@{transcript.metadata.author.username}</div>
                                </div>
                            </div>
                            <span className="text-lg font-bold mb-2 text-gray-700">{transcript.metadata.description}</span>
                            <div className="text-sm text-gray-700">
                                <div className="mb-2">
                                    <span className="font-semibold text-red-600">Platform:</span> {transcript.metadata.platform &&
                                        transcript.metadata.platform.charAt(0).toUpperCase() +
                                        transcript.metadata.platform.slice(1).toLowerCase()
                                    }
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Video URL:</span> <a href={transcript.metadata.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{transcript.metadata.videoUrl}</a>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="mb-2 flex items-center gap-1">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript.metadata.stats.views)} views
                                    </div>
                                    <div className="mb-2 flex items-center gap-1">
                                        <Heart className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript.metadata.stats.likes)} likes
                                    </div>
                                    <div className="mb-2 flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript.metadata.stats.comments)} comments
                                    </div>
                                    <div className="mb-2 flex items-center gap-1">
                                        <Share2 className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript.metadata.stats.shares)} shares
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);

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