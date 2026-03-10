import Image from "next/image";
import { UploadCloud, Loader2, FileText, Download } from "lucide-react";

const TranscriptSteps = [
    {
        title: "Upload Your Video",
        description: "Select the video file you want to transcribe.",
        image: "/image/process1.png",
        icon: UploadCloud,
    },
    {
        title: "Processing",
        description: "Our system will process your video and generate a transcript.",
        icon: Loader2,
    },
    {
        title: "Copy Transcript",
        description: "Copy the transcript and make any necessary edits.",
        icon: FileText,
    },
    {
        title: "Download",
        description: "Download the final transcript in your preferred format.",
        icon: Download,
    }
];

export default function TranscriptProcess() {
    return (
        <div className="">
            {/* <h1 className="text-2xl font-bold mb-8 bg-blue-100 rounded-lg text-center py-3">Transcript Process</h1> */}
            <div className="flex flex-col md:flex-row gap-8 justify-between">
                <div className="w-full md:w-[40%] flex-shrink-0">
                    <Image
                        src="/image/process.png"
                        alt="Process Image"
                        width={400}
                        height={400}
                        quality={100}
                        priority
                        className="rounded-2xl shadow-md w-full h-auto object-contain"
                    />
                </div>
                <ol className="w-full md:w-1/2 space-y-6">
                    {TranscriptSteps.map((step, idx) => (
                        <li key={step.title} className="flex items-start gap-4 bg-background rounded-xl shadow p-4 transition hover:shadow-lg">
                            <div className="flex flex-col items-center mr-2">
                                <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                                    <step.icon className="w-6 h-6" />
                                </span>
                                {idx < TranscriptSteps.length - 1 && (
                                    <span className="h-8 w-1 bg-blue-200 block mx-auto" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="font-semibold text-lg mb-1">{step.title}</h2>
                                <p className="text-gray-600 mb-2">{step.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
