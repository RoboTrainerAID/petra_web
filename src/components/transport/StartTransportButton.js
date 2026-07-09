import React from "react";
import {useTranslation} from "react-i18next";

//Styling
import "./StartTransportButton.css";

//Icons&Images
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import {FaFlagCheckered} from "react-icons/fa";

//Components
import {Button} from "react-bootstrap";


export default function TransportButton({startTransport, remainingTimeTransport, setRemainingTimeTransport}) {
    const {t} = useTranslation();
    const [started, setStarted] = React.useState(null);
    let [progressTimer, setProgressTimer] = React.useState(null);

    function handleStart() {
        setStarted('1');
        setProgressTimer(progressTimer*60)
    }

    React.useEffect(() => {
        if (remainingTimeTransport > 0 && started === '1') {
            console.log(remainingTimeTransport)
            progressTimer = setTimeout(() => {
                setRemainingTimeTransport(remainingTimeTransport - 0.01)
            }, 1000);
        } else {

        }

    });

    function handlePause() {
        setStarted('2')
    }

    function handleContinue() {
        setStarted('1')
    }

    if (started === null && startTransport === null) {
        return (
            null
        );
    }
    if (started === null) {
        return (
            <Button className="button-start"
                    variant="success"
                    size="lg"
                    onClick={handleStart}>
                <PlayArrowIcon className="button-icon"/>
                <div className="button-text">
                    {t('navigation_button_start')}
                </div>
            </Button>
        );
    }
    if (started === '1' && remainingTimeTransport > '0') {
        return (
            <Button className="button-start"
                    variant="warning"
                    size="lg"
                    onClick={handlePause}>
                <PauseIcon className="button-icon"/>
                <div className="button-text">
                    {t('navigation_button_pause')}
                </div>
            </Button>
        );
    }
    if (started === '2') {
        return (
            <Button className="button-start"
                    variant="success"
                    size="lg"
                    onClick={handleContinue}>
                <PlayArrowIcon className="button-icon"/>
                <div className="button-text">
                    {t('navigation_button_continue')}
                </div>
            </Button>
        );
    }
    else {
        return (
            <Button className="button-start"
                    variant="secondary"
                    disabled
                    size="lg">
                <FaFlagCheckered className="button-icon"/>
                <div className="button-text">
                    {t('navigation_button_arrived')}
                </div>
            </Button>
        );
    }
}
