import { useState, useCallback, useEffect } from "react"
import { TranscriptData, RecentTranscriptData } from "@/types/transcribe";
import { TranscribeService } from "@/services/transcribe";
import { showToaster } from "@/lib/utils";
import { downloadService } from "@/services/download";
import { useTranscribeProgress } from "./useTranscribeProgress";

export function useTranscription() {
    const [recentTranscripts, setRecentTranscripts] = useState<RecentTranscriptData[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [transcribeJobId, setTranscribeJobId] = useState<string | null>(null);

    const { progress, status, transcript } = useTranscribeProgress(transcribeJobId);

    const fetchRecentTranscripts = useCallback(async () => {
        setIsFetching(true);
        try {
            const res = await TranscribeService.getRecentTranscripts();
            setRecentTranscripts(res);
        } catch (error) {
            console.error("Error fetching recent transcripts:", error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        if (status === "completed") {
            fetchRecentTranscripts();
        }
    }, [status, fetchRecentTranscripts]);

    const submitTranscription = useCallback(
        async (videoUrl: string, captchaToken: string) => {
            setLoading(true);
            setError(null);

            try {
                const { jobId } = await TranscribeService.createTranscription(videoUrl, captchaToken);

                setTranscribeJobId(jobId);

                showToaster("Transcription started!", "success");

            } catch (err) {
                console.log("Transcribing error", err);
                showToaster("Failed to generate transcript", "error");
            } finally {
                setLoading(false);
            }
        },
        []);

    const downloadVideo = async (videoUrl: string, captchaToken: string | null) => {
        if (!videoUrl || !captchaToken) return;

        setIsDownloading(true);

        try {
            const { jobId } = await downloadService.downloadVideo(videoUrl, captchaToken);

            showToaster('Download started!', "success");

            return jobId;

        } catch (error) {
            console.error("Error downloading video:", error);
        } finally {
            setIsDownloading(false);
        }
    }



    return {
        loading,
        error,
        progress,
        transcript,
        submitTranscription,
        isFetching,
        recentTranscripts,
        fetchRecentTranscripts,
        isDownloading,
        downloadVideo,
        status
    }
}