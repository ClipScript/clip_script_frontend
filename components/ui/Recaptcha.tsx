import { useEffect, useRef } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";

export default function Recaptcha({
    onChange,
}: {
    onChange: (token: string | null) => void;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<number | null>(null);

    const { isReady } = useRecaptcha();

    useEffect(() => {
        if (!isReady || !window.grecaptcha || !containerRef.current) return;

        // Prevent duplicate render (important for Strict Mode)
        if (widgetIdRef.current !== null) return;

        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onChange,
            "expired-callback": () => onChange(null),
        });
    }, [isReady, onChange]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 1000,
                background: "rgba(255,255,255,0.95)",
                borderRadius: 12,
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                padding: 8,
            }}
        />
    );
}