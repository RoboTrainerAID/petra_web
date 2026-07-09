import {useTranslation} from "react-i18next";
import {Paper, Typography} from "@material-ui/core";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

/**
 * Views that no transport is currently active and a button that redirects to the staff login
 * @constructor
 */
export function NoTransportActiveCard() {
    const { t } = useTranslation();

    return (
        <Paper style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            width: "97%"
        }}>
            <Typography>
                {t("transport_cards_no_transport_active")}
            </Typography>
            <div style={{flexGrow: 1}}/>
            <Link to={"/login"}>
                <Button color={"primary"}>
                    {t("transport_cards_go_to_staff_area")}
                </Button>
            </Link>
        </Paper>
    )
}
