import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Fab from "@material-ui/core/Fab";
import TuneIcon from "@material-ui/icons/Tune";

function TuneDialog() {
    const [open, setOpen] = React.useState(false);

    const ArduinoIpAddressRef = useRef();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        //alert("Save settings to be done...");
        alert(ArduinoIpAddressRef.current.value)
        setOpen(false);
    };

    return (
        <div>
            <Fab color="secondary" aria-label="tune" onClick={handleClickOpen}>
                <TuneIcon/>
            </Fab>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Fog Machine Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                    <TextField autoFocus margin="dense" id="ArduinoIpAddress" label="Arduino Prop IP Address" type="text"
                               pattern={["^.{7,15}$", "(?=.*\\d)", "(?=.*\\.)"]} fullWidth inputRef={ArduinoIpAddressRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TuneDialog;