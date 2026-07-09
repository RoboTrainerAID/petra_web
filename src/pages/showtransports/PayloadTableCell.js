import {usePayload} from "../../petra_central_control/usePayload";
import {CircularProgress, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {getPayloadType} from "../../constants/PayloadTypes";

export function PayloadTableCell({ payload }) {
    const [ payloadData, info, setPayload, removePayload ] = usePayload(payload);

    if (!info.isSuccess) {
        return <ListItem>
            <ListItemIcon>
                <CircularProgress/>
            </ListItemIcon>
            <ListItemText primary={"Loading..."}/>
        </ListItem>
    }

    const payloadType = getPayloadType(payloadData.type);
    const payloadName = payloadType.formatName(payloadData);

    return (
        <ListItem>
            <ListItemIcon>
                <payloadType.i/>
            </ListItemIcon>
            <ListItemText primary={payloadName}/>
        </ListItem>
    )
}
