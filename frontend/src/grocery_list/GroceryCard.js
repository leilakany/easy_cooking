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
import GreenCheckbox from './CbxGrocery';
import AssignmentIcon from '@material-ui/icons/Assignment';
import useStyles from './styles'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import axios from 'axios';

const backendUrl = "http://127.0.0.1:9000/"

export default function GroceryCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const groceryName = props.name
    const databaseId = props.databaseId
    const listIndex = props.idx
    const [neededItems, setNeededItems] = React.useState(props.items)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const groceryEndpoint = backendUrl + "grocery_list/" + databaseId

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const changeItemState = (itemIndex, checkedState) => {
        // Item
        const tmpItems = neededItems

        // change item state
        let changeItemStateEndpoint = groceryEndpoint + "/item/" + tmpItems[itemIndex]._id
        axios.patch(changeItemStateEndpoint).then(resp => {
            //frontend changes
            tmpItems[itemIndex].checked = !checkedState
            setNeededItems([...tmpItems])
            }).catch(err => {
            console.log(err)
        })
    };


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const removeList = () => {
        axios.delete(groceryEndpoint).then(resp => {
            props.unmountList(listIndex)
            handleClose()
        }).catch(err => {
            console.log(err)
        })

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
                title={groceryName}
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
                                control={<GreenCheckbox checked={item.checked} onChange={(e, data) => changeItemState(idx, item.checked)} />}
                                label={item.name}
                            />
                        </Typography>)
                    }) : "Nothing to buy !"}
                </CardContent>
            </Collapse>
        </Card>
    );
}
