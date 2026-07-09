import {Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {TransportDetailsGrid} from "../transport/TransportDetailsGrid";
import {useTransport} from "../../petra_central_control/useTransport";

const useStyles = makeStyles(() => ({

}));

export function ModalDeleteTransport({ show, transport_id, onHide, onConfirm }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ transport, tInfo, ] = useTransport(transport_id);

    return (
        <Dialog
            open={show}
            onClose={onHide}
        >
            <DialogTitle>
                {t("modal_delete_transport_title")}
            </DialogTitle>
            <DialogContent>
                {tInfo.isSuccess && <TransportDetailsGrid transport={transport} />}
            </DialogContent>
            <DialogActions>
                <Button variant={"contained"} color={"primary"} onClick={onConfirm}>
                    {t("modal_delete_transport_confirm")}
                </Button>
                <Button variant={"contained"} onClick={onHide}>
                    {t("modal_delete_transport_cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
