declare global {
    interface Window {
        grecaptcha?: any;
    }
}
import { useEffect, useRef } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";

export default function Recaptcha({ onChange }: { onChange: (token: string | null) => void }) {
    const renderedRef = useRef(false);
    const { isReady } = useRecaptcha();

    useEffect(() => {
        if (!isReady || renderedRef.current) return;

        window.grecaptcha.render("recaptcha-container", {
            sitekey: siteKey,
            callback: onChange,
            "expired-callback": () => onChange(null),
        });

        renderedRef.current = true;
    }, [isReady, onChange]);

    return <div id="recaptcha-container" />;
}
