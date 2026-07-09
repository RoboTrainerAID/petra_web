import {useCallback} from "react";
import {useTranslation} from "react-i18next";

export function useTTS() {
    const { i18n } = useTranslation();
    const isEnabled = !!window.speechSynthesis;
    const speak = useCallback((text) => {
        if (isEnabled) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = i18n.language;
            window.speechSynthesis.cancel(); //TODO: find better way to allow reuse of speak function
            window.speechSynthesis.speak(utterance);
        } else {
            // if not enabled, do nothing but print to console
            console.log("Text To Speech is not available");
        }
    }, [ isEnabled, i18n.language ]);

    return [ isEnabled, speak ];
}
