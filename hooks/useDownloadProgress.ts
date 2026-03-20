import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

export function useDownloadProgress(jobId: string | null) {
    const socketRef = useSocket();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "downloading" | "completed" | "error">("idle");

    useEffect(() => {
        if (!jobId) return;
        const socket = socketRef.current;
        if (!socket) return;

        // Reset state for new job
        setProgress(0);
        setStatus("downloading");

        // Handlers
        const handleProgress = (value: number) => setProgress(value);
        const handleCompleted = () => {
            setProgress(100);
            setStatus("completed");
        };
        const handleError = () => setStatus("error");

        // Subscribe to events
        socket.on(`progress-${jobId}`, handleProgress);
        socket.on(`completed-${jobId}`, handleCompleted);
        socket.on(`error-${jobId}`, handleError);

        // Cleanup
        return () => {
            socket.off(`progress-${jobId}`, handleProgress);
            socket.off(`completed-${jobId}`, handleCompleted);
            socket.off(`error-${jobId}`, handleError);
            setStatus("idle");
        };
    }, [jobId, socketRef.current]); // <-- use socketRef.current to trigger effect when socket is ready

    return { progress, status };
}