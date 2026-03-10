"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "What platforms are supported for transcription?",
        answer:
            "We support TikTok, Instagram Reels, and YouTube Shorts. Just paste your video link to get started!",
    },
    {
        question: "Is there a limit to the video length I can transcribe?",
        answer:
            "Currently, we support videos up to 10 minutes in length for best performance.",
    },
    {
        question: "How accurate are the transcriptions?",
        answer:
            "Our AI-powered system provides high accuracy. We recommend proofreading and editing the transcript for best results, especially for videos with background noise or multiple speakers.",
    },
    {
        question: "Is my video data stored or shared?",
        answer:
            "Yes, Every Transcription is stored for retrieval for a limited time.",
    },
    {
        question: "What formats can I download my transcript in?",
        answer:
            "You can download your transcript as plain text or PDF. More formats coming soon!",
    },
    {
        question: "Do I need to create an account?",
        answer:
            "No account is required. Just paste your link and transcribe instantly.",
    },
    {
        question: "Is this service free?",
        answer:
            "Yes, our basic transcription service is free to use. Premium features may be added in the future.",
    },
    {
        question: "Can I transcribe private or unlisted videos?",
        answer:
            "We can only transcribe videos that are publicly accessible.",
    },
    {
        question: "Who can I contact for support?",
        answer:
            "Reach out via our contact form or email support for any assistance.",
    },
];

export default function Faqs() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                Frequently Asked Questions
            </h2>
            <ul className="space-y-4">
                {faqs.map((faq, idx) => (
                    <li
                        key={faq.question}
                        className="border border-primary/30 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <button
                            className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
                            onClick={() => handleToggle(idx)}
                            aria-expanded={openIndex === idx}
                        >
                            <span className="font-semibold text-primary text-lg">
                                {faq.question}
                            </span>
                            <span className="ml-4">
                                {openIndex === idx ? (
                                    <Minus className="w-6 h-6 text-primary" />
                                ) : (
                                    <Plus className="w-6 h-6 text-primary" />
                                )}
                            </span>
                        </button>
                        {openIndex === idx && (
                            <div className="px-6 pb-4 text-gray-700 animate-fade-in">
                                {faq.answer}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

