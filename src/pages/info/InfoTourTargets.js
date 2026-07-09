/**
 * Utility function which creates both css class name and react-tour target strings
 * @param name
 * @returns {{css, target: string}}
 */
function createTarget(name) {
    return {
        css: name,
        target: `.${name}`,
    }
}

const targets = {
    PETRA_AVATAR: createTarget("petra-avatar"),
    PETRA_DIALOG_AREA: createTarget("petra-dialog"),
    PETRA_SPEAK_BUTTON: createTarget("petra-speak"),
    PETRA_LANGUAGE_SELECTOR: createTarget("petra-language"),
    TRANSPORT_DETAILS_AREA: createTarget("transport-details"),
    BUTTON_START_TRANSPORT: createTarget("start-transport"),
    BUTTON_EMERGENCY: createTarget("button-emergency"),
    MAP_FULL: createTarget("map-full"),
    MAP_STOPS: createTarget("map-stops"),
    APP_HOME: createTarget("app-home"),
    APP_NAVIGATION: createTarget("app-navigation"),
    APP_TRANSLATION: createTarget("app-translation"),
    APP_ENTERTAINMENT: createTarget("app-entertainment")
};

export default targets;
