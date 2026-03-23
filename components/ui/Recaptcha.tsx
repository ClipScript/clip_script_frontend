declare global {
    interface Window {
        grecaptcha?: any;
    }
}
import { useEffect, useRef } from "react";

const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";

export default function Recaptcha({ onChange }: { onChange: (token: string | null) => void }) {
    const renderedRef = useRef(false);

    useEffect(() => {
        if (window.grecaptcha) return;
        const script = document.createElement("script");
        script.id = "recaptcha-script";
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (!window.grecaptcha || renderedRef.current) return;

        window.grecaptcha.ready(() => {
            window.grecaptcha.render("recaptcha-container", {
                sitekey: siteKey,
                callback: onChange,
                "expired-callback": () => onChange(null),
            });

            renderedRef.current = true;
        });
    }, [onChange]);

    return <div id="recaptcha-container" />;
}
