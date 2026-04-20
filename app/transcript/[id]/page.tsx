"use client";
import { Layout } from "@/components/genreral/layout";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { TranscribeService } from "@/services/transcribe";
import { useTranscription } from "@/hooks/useTranscribe";
import { useState } from "react";
import { TranscriptData } from "@/types/transcribe";
import { Loader } from "@/components/genreral/loader";
import { copyToClipboard, downLoadFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HiArrowLongLeft } from 'react-icons/hi2';
import { downLoadVideo, downloadUtterances } from "@/lib/utils";
import { SpinnerLoader } from "@/components/genreral/common";
import { Clipboard, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { downloadFileActions } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { formatCount } from "@/lib/utils";
import { Copy, Link, FileText, Eye, Heart, MessageCircle, Share2 } from "lucide-react";



export default function TranscriptPage() {
    const { id } = useParams();
    const router = useRouter();
    const { recentTranscripts } = useTranscription();
    const [singleTranscript, setSingleTranscript] = useState<TranscriptData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [viewMode, setViewMode] = useState<boolean>(false);


    useEffect(() => {
        const fetchTranscript = async () => {
            if (typeof id === "string") {
                setIsLoading(true);
                try {
                    const data = await TranscribeService.getTranscriptById(id);
                    setSingleTranscript(data);
                } catch (err) {
                    console.error(`Failed to fetch transcript for ID ${id}:`, err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchTranscript();
    }, [id]);

    return (
        <Layout>
            {isLoading ? (
                <Loader />
            ) : singleTranscript === null ? (
                <div className="text-center">
                    <p className="text-gray-600">Transcript not found.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <button
                        className="flex items-center gap-2 text-gray-600 hover:text-primary w-fit cursor-pointer"
                        onClick={() => router.back()}
                        aria-label="Go back"
                    >
                        <HiArrowLongLeft size={30} color='text-primary' />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center justify-between">
                        <Switch
                            id="viewModeToggle"
                            checked={viewMode}
                            onCheckedChange={() => setViewMode(!viewMode)}
                        />
                        <div className="flex items-center gap-2">
                            <Clipboard
                                className="w-5 h-5 text-primary cursor-pointer"
                                onClick={() => {
                                    const textToCopy = !viewMode ? singleTranscript?.transcript : downloadUtterances(singleTranscript?.utterances);
                                    copyToClipboard(textToCopy || '');
                                }}
                            />

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
                                                        ? downloadUtterances(singleTranscript?.utterances)
                                                        : (singleTranscript?.transcript?.replace(/([.?!])\s*/g, '$1\n') || "")

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
                    <pre className="bg-muted text-primary font-mono p-4 rounded max-h-[70vh] overflow-auto whitespace-pre-wrap">
                        {!viewMode ? singleTranscript?.transcript : downloadUtterances(singleTranscript?.utterances)}
                    </pre>
                    <div className="w-full md:1/2 bg-white/80 rounded-xl shadow p-6 border border-gray-200 flex items-start gap-6">
                        <div className="mb-2 w-full">
                            {singleTranscript.metadata.media.thumbnailUrl && (
                                <img
                                    src={singleTranscript.metadata.media.thumbnailUrl}
                                    alt="Thumbnail"
                                    className="rounded-lg border border-gray-200 object-cover"
                                />
                            )}
                        </div>
                        <section className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                {singleTranscript.metadata.author.avatarUrl && (
                                    <img
                                        src={singleTranscript.metadata.author.avatarUrl}
                                        alt="Avatar"
                                        className="rounded-full border border-gray-300 object-cover w-14 h-14"
                                    />
                                )}
                                <div>
                                    <div className="font-semibold text-base">{singleTranscript.metadata.author.displayName}</div>
                                    <div className="text-sm text-gray-500">@{singleTranscript.metadata.author.username}</div>
                                </div>
                            </div>
                            <span className="text-lg font-bold mb-2 text-gray-700">{singleTranscript.metadata.description}</span>
                            <div className="text-sm text-gray-700">
                                <div className="mb-2">
                                    <span className="font-semibold text-red-600">Platform:</span> {singleTranscript.metadata.platform &&
                                        singleTranscript.metadata.platform.charAt(0).toUpperCase() +
                                        singleTranscript.metadata.platform.slice(1).toLowerCase()
                                    }
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Video URL:</span> <a href={singleTranscript.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{singleTranscript.videoUrl}</a>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="mb-2 flex items-center gap-1">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        {formatCount(singleTranscript.metadata.stats.views)} views
                                    </div>
                                    <div className="mb-2 flex items-center gap-1">
                                        <Heart className="w-4 h-4 text-gray-500" />
                                        {formatCount(singleTranscript.metadata.stats.likes)} likes
                                    </div>
                                    <div className="mb-2 flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4 text-gray-500" />
                                        {formatCount(singleTranscript.metadata.stats.comments)} comments
                                    </div>
                                    <div className="mb-2 flex items-center gap-1">
                                        <Share2 className="w-4 h-4 text-gray-500" />
                                        {formatCount(singleTranscript.metadata.stats.shares)} shares
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </Layout>
    );
}
