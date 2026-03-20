import { axiosInstance } from "@/lib/utils";

export const downloadService = {
    downloadVideo: async (videoUrl: string, captchaToken: string) => {
        const response = await axiosInstance.post('/downloader/download', {
            videoUrl,
            captchaToken
        });
        console.log("Download job created:", response.data);
        return response.data;
    },

}