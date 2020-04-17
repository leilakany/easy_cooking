import React from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GroceriesPic from '../assets/groceries.jpg'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GreenCheckbox from './cbx_grocery';
import AssignmentIcon from '@material-ui/icons/Assignment';
import useStyles from './styles'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import axios from 'axios';
const backend_url = "http://127.0.0.1:9000/"

export default function GroceryCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const name = props.name
    const db_id = props.db_id
    const list_index = props.idx
    const [neededItems, setNeededItems] = React.useState(props.items)

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleChange = (key, value) => {
        const tmp_items = neededItems
        tmp_items[key].checked = !value
        setNeededItems([...tmp_items])
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const removeList = () => {
        let remove_list_url = backend_url + "grocery_list/" + db_id
        axios.delete(remove_list_url).then(resp => {
            console.log("deleted list")
        })
        props.unmountList(list_index)
        handleClose()
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card className={classes.root}>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={removeList}>Remove list</MenuItem>
                <MenuItem onClick={handleClose}>Add to default list</MenuItem>
            </Menu>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        <AssignmentIcon className={classes.green} />
                    </Avatar>
                }
                action={
                    <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={name}
            />
            <CardMedia
                className={classes.media}
                image={GroceriesPic}
                title="Groceries"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    Click on 'More' to see al items you need !
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="confirm list">
                    <AssignmentTurnedInIcon />
                </IconButton>
                <p>Confirm</p>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
                <p onClick={handleExpandClick}>More</p>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {neededItems.length ? neededItems.map((item, idx) => {
                        return (<Typography>
                            <FormControlLabel
                                control={<GreenCheckbox checked={item.checked} onChange={(e, data) => handleChange(idx, item.checked)} />}
                                label={item.name}
                            />
                        </Typography>)
                    }) : "Nothing to buy !"}
                </CardContent>
            </Collapse>
        </Card>
    );
}
