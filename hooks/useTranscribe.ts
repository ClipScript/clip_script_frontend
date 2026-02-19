import { useState, useCallback } from "react"
import { TranscriptData, RecentTranscriptData } from "@/types/transcribe";
import { TranscribeService } from "@/services/transcribe";
import { showToaster } from "@/lib/utils";

export function useTranscription() {
    const [transcript, setTranscript] = useState<TranscriptData | null>(null);
    const [recentTranscripts, setRecentTranscripts] = useState<RecentTranscriptData[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);


    const submitTranscription = useCallback(async (videoUrl: string, captchaToken: string) => {
        setLoading(true);
        setError(null);
        setProgress(0);

        try {
            const { jobId } = await TranscribeService.createTranscription(videoUrl, captchaToken);

            const result = await pollJobStatus(jobId);
            setTranscript({
                transcript: result.transcript,
                status: result.status,
                jobId: result.jobId
            });
            fetchRecentTranscripts();
        } catch (err: any) {
            showToaster(err.message || 'Failed to generate transcript',);
        } finally {
            setLoading(false);
        }
    }, []);



    const pollJobStatus = async (jobId: string): Promise<TranscriptData> => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    const status = await TranscribeService.getJobStatus(jobId);

                    setProgress(status.progress || 0);

                    if (status.status === 'completed') {
                        clearInterval(interval);
                        const result = await TranscribeService.getJobResult(jobId);
                        resolve(result);
                    } else if (status.status === 'failed') {
                        clearInterval(interval);
                        reject(new Error('Transcription failed'));
                    }
                } catch (error) {
                    clearInterval(interval);
                    reject(error);
                }
            }, 2000); // Poll every 2 seconds

            // Timeout after 5 minutes
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error('Transcription timeout'));
            }, 300000);
        });
    };


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

    return {
        loading,
        error,
        progress,
        transcript,
        submitTranscription,
        isFetching,
        recentTranscripts,
        fetchRecentTranscripts,
    }
}