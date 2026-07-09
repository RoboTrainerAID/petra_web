import React, {useCallback, useEffect} from 'react';

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import {Button, Modal} from "react-bootstrap";
import FormControl from "@material-ui/core/FormControl";
import {MenuItem} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
    root: {
        height: "20px",
        paddingTop: "12px",
        paddingBottom: "10px",
    },
})

const data = [
    {
        platform: 'Nr. 1',
        value: 1,
    },
    {
        platform: 'Nr. 2',
        value: 2,
    },
    {
        platform: 'Nr. 3',
        value: 3,
    },
    {
        platform: 'Nr. 4',
        value: 4,
    },
    {
        platform: 'Nr. 5',
        value: 5,
    },
    {
        platform: 'Nr. 6',
        value: 6,
    },
    {
        platform: 'Nr. 7',
        value: 7,
    },
    {
        platform: 'Nr. 8',
        value: 8,
    },
]

export default function ModalAssignPlatform(props) {
    const { t } = useTranslation();

    const classes = useStyles();
    const [platformNr, setPlatformNr] = React.useState(props.selectedPlatform);
    useEffect(() => setPlatformNr(props.selectedPlatform), [ props.selectedPlatform ]); //update selected platform whenever the prop changes

    const onConfirm = useCallback(() => {
        props.onSetPlatform(platformNr);
    }, [ props, platformNr ]);


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {t("platform_assign_title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {t("platform_assign_body")}
                </p>
                <FormControl variant="outlined" style={{
                    width: "170px",
                }}>
                    <Select
                        value={platformNr}
                        onChange={(e) => setPlatformNr(e.target.value)}
                        classes={{
                            root: classes.root
                        }}
                        MenuProps={{
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                            },
                            transformOrigin: {
                                vertical: "top",
                                horizontal: "left"
                            },
                            getContentAnchorEl: null
                        }}>
                        {data.map(data => {
                            return (
                                <MenuItem value={data.value}>{data.platform}</MenuItem>)
                        }
                        )}
                    </Select>
                </FormControl>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>{t("platform_assign_cancel")}</Button>
                <Button onClick={onConfirm}>{t("platform_assign_confirm")}</Button>
            </Modal.Footer>
        </Modal>
    );
}
