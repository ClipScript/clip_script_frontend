import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"

const API_URL = process.env.NEXT_PUBLIC_API_URL

console.log(API_URL)


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
  a.download = 'transcript.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToaster('File downloaded!', 'success');
}