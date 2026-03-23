import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"
import { UtteranceType } from "@/types/transcribe";
import {
  FileText,
  FileSpreadsheet,
  FileJson,
  FileType,
  FileDown
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const axiosInstance = axios.create({
  baseURL: API_URL,
  // timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


export const showToaster = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
  toast(message, { type });
};


export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToaster('Copied to clipboard!', 'success');
    }).catch(err => {
      showToaster('Failed to copy!', 'error');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToaster('Copied to clipboard!', 'success');
    } catch (err) {
      showToaster('Failed to copy!', 'error');
    }
    document.body.removeChild(textarea);
  }
}


export const downLoadFile = (content: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clipscript_transcript.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToaster('File downloaded!', 'success');
}

type FileType = 'txt' | 'pdf' | 'docx' | 'csv';

export const downloadFile = async (
  content: string,
  type: FileType
) => {
  switch (type) {
    case 'txt': {
      const blob = new Blob([content], { type: 'text/plain' });
      triggerDownload(blob, 'Clip_Script.txt');
      break;
    }

    case 'pdf': {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.text(content, 10, 10);
      doc.save('Clip_Script.pdf');
      break;
    }

    case 'docx': {
      const { Document, Packer, Paragraph } = await import('docx');
      const { saveAs } = await import('file-saver');

      const doc = new Document({
        sections: [{ children: [new Paragraph(content)] }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Clip_Script.docx');
      break;
    }

    case 'csv': {
      const blob = new Blob([content], { type: 'text/csv' });
      triggerDownload(blob, 'Clip_Script.csv');
      break;
    }
  }
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downLoadVideo = async (jobId?: string) => {
  if (!jobId) return;
  try {
    const res = await fetch(`${API_URL}/transcription/${jobId}/download`);
    if (!res.ok) {
      console.error("Failed to fetch video:", res);
      showToaster("Failed to download video. Please try again later.");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clipscript_${jobId}.mp4`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    showToaster("Failed to download video. Please try again later.");
    console.error(err);
  }
};


// Helper to format ms to mm:ss
export function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


export function downloadUtterances(transcript: Array<UtteranceType> | undefined) {
  const utteranceText = transcript?.map(utt => `${formatMs(utt.start)} - ${utt.text}`).join('\n');
  return utteranceText;
}



export const downloadFileActions = [
  {
    label: "PDF",
    icon: FileText,
    onClick: (transcript: string) => downloadFile(transcript, 'pdf')
  },
  {
    label: "TXT",
    icon: FileText,
    onClick: (transcript: string) => downloadFile(transcript, 'txt')
  },
  {
    label: "DOCX",
    icon: FileType,
    onClick: (transcript: string) => downloadFile(transcript, 'docx')
  },
  {
    label: "CSV",
    icon: FileSpreadsheet,
    onClick: (transcript: string) => downloadFile(transcript, 'csv')
  },
];

export const detectPlatform = (url: string) => {
  if (url.includes("youtube.com/shorts") || url.includes("youtu.be")) {
    return "YouTube";
  } else if (url.includes("tiktok.com")) {
    return "TikTok";
  } else if (url.includes("instagram.com")) {
    return "Instagram";
  } else {
    return null;
  }
}

