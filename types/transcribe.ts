export interface TranscriptData {
    transcript: string;
    metadata: {
        platform?: string;
        videoUrl?: string;
        description?: string;
        author: {
            username: string;
            displayName: string;
            avatarUrl: string;
        };
        media: {
            thumbnailUrl: string;
        };
        stats: {
            views: number;
            likes: number;
            comments: number;
            shares: number;
        }
    };
    utterances?: Array<{
        text: string;
        start: number;
        end: number;
    }>;
}

export type UtteranceType = {
    text: string;
    start: number;
    end?: number;
}

export interface RecentTranscriptData {
    transcript: string;
    createdAt?: string;
    jobId?: string;
    _id: string;
    platform?: string,
    videoUrl?: string,
    utterances?: Array<UtteranceType>;
}