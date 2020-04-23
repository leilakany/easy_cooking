import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function ConfirmGroceryModal(props) {
    const [open, setOpen] = React.useState(true);
    const [checkAllItems, setCheckAllItems] = React.useState(false);

    const handleConfirm = () => {
        // Add to fridge endpoint
        let confirmEndpoint = props.groceryEndpoint + "/confirm"
        axios.patch(confirmEndpoint, { checkall:checkAllItems}).then(resp => {
            console.log(resp.data)
        }).catch(err => {
            console.log(err.message)
        })

        /**
         * Tell parent that we want to validate all items even
         * the non selected ones
         */
        if(checkAllItems){
            props.checkAll()
        }
        handleClose();
    }

    const handleClose = () => {
        props.closingModal();
        setCheckAllItems(false);
        setOpen(false);
    };

    return (
        <div>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Confirm your grocery list
                </DialogTitle>
                <DialogContent dividers>
                    Add selected items to your fridge, or add everything in your list by checking "Add all"
                    <FormGroup row>
                        <FormControlLabel
                            control={<Switch checked={checkAllItems} onChange={() => setCheckAllItems(prev => !prev)} name="checkedA" />}
                            label="Add all"
                        />
                    </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose} color="primary">
                            Close
                        </Button>
                        <Button autoFocus onClick={handleConfirm} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
            </Dialog>
        </div>
    );
}
