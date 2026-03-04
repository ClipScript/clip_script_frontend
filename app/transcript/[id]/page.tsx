"use client";
import { Layout } from "@/components/genreral/layout";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { TranscribeService } from "@/services/transcribe";
import { useTranscription } from "@/hooks/useTranscribe";
import { useState } from "react";
import { RecentTranscriptData } from "@/types/transcribe";
import { Loader } from "@/components/genreral/loader";
import { copyToClipboard, downLoadFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HiArrowLongLeft } from 'react-icons/hi2';
import { downLoadVideo, downloadUtterances } from "@/lib/utils";
import { SpinnerLoader } from "@/components/genreral/common";
import { Clipboard, Download, Clock, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";



export default function TranscriptPage() {
    const { id } = useParams();
    const router = useRouter();
    const { recentTranscripts } = useTranscription();
    const [singleTranscript, setSingleTranscript] = useState<RecentTranscriptData | null>(null);
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

        if (id && recentTranscripts.length > 0) {
            const transcript = recentTranscripts.find(t => t._id === id);
            console.log("Found transcript in recent transcripts:", transcript);
            setSingleTranscript(transcript ?? null);
            return;
        } else {
            fetchTranscript();
        }
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

                            <Download
                                className="w-5 h-5 text-primary cursor-pointer"
                                onClick={() => {
                                    const downloadVideoFile = !viewMode ? singleTranscript?.transcript : downloadUtterances(singleTranscript?.utterances);
                                    downLoadFile(downloadVideoFile!);
                                }}
                            />
                        </div>
                    </div>
                    <pre className="bg-muted text-primary font-mono p-4 rounded max-h-[70vh] overflow-auto whitespace-pre-wrap">
                        {!viewMode ? singleTranscript?.transcript : downloadUtterances(singleTranscript?.utterances)}
                    </pre>
                    <div className="flex gap-4 mt-4 justify-end">
                        <Button
                            variant="default"
                            className="flex items-center gap-2 bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                            onClick={async () => {
                                setIsDownloading(true);
                                await downLoadVideo(singleTranscript?.jobId);
                                setIsDownloading(false);
                            }}
                            disabled={isDownloading}
                        >
                            {isDownloading ? <SpinnerLoader /> : <>  <Download className="w-4 h-4" /> Download Video</>}
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
}
