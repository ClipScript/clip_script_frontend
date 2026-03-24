import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        grecaptcha?: any;
    }
}

const RECAPTCHA_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

export function useRecaptcha() {
    const [isReady, setIsReady] = useState(false);
    const loadingRef = useRef(false);

    useEffect(() => {
        // Already ready
        if (window.grecaptcha?.render) {
            setIsReady(true);
            return;
        }

        // Prevent loading script multiple times
        if (loadingRef.current) return;
        loadingRef.current = true;

        const existingScript = document.querySelector(
            `script[src="${RECAPTCHA_SRC}"]`
        );

        if (existingScript) {
            waitForReady();
            return;
        }

        const script = document.createElement("script");
        script.src = RECAPTCHA_SRC;
        script.async = true;
        script.defer = true;

        script.onload = waitForReady;

        document.body.appendChild(script);

        function waitForReady() {
            if (!window.grecaptcha) return;

            window.grecaptcha.ready(() => {
                setIsReady(true);
            });
        }
    }, []);

    return { isReady };
}