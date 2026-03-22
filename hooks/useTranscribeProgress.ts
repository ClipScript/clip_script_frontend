import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { TranscriptData } from "@/types/transcribe";


export function useTranscribeProgress(jobId: string | null) {
    const socketRef = useSocket();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
    const [transcript, setTranscript] = useState<TranscriptData | null>(null);

    useEffect(() => {
        if (!jobId) return;
        const socket = socketRef.current;
        if (!socket) return;

        setStatus("processing");
        setProgress(0);

        const handleProgress = (value: number) => setProgress(value);

        const handleCompleted = (data: TranscriptData) => {
            setProgress(100);
            setStatus("completed");
            setTranscript(data);

        };

        const handleError = () => setStatus("error");

        socket.on(`progress-transcribe-${jobId}`, handleProgress);
        socket.on(`completed-transcribe-${jobId}`, handleCompleted);
        socket.on(`error-transcribe-${jobId}`, handleError);

        return () => {
            socket.off(`progress-transcribe-${jobId}`, handleProgress);
            socket.off(`completed-transcribe-${jobId}`, handleCompleted);
            socket.off(`error-transcribe-${jobId}`, handleError);
        };
    }, [jobId, socketRef.current]);

    return { progress, status, transcript };
}