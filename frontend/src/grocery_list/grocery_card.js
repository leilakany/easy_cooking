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
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GroceriesPic from '../assets/groceries.jpg'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GreenCheckbox from './cbx_grocery';
import AssignmentIcon from '@material-ui/icons/Assignment';
import useStyles from './styles'


export default function GroceryCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const name = props.name
    const [neededItems, setNeededItems] = React.useState(props.items)
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleChange = (key, value) => {
       const tmp_items = neededItems
       tmp_items[key].checked = !value
       setNeededItems([...tmp_items])
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                      <AssignmentIcon className={classes.green}/>
                  </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                        {/* TODO : add a setting panel */}
                    </IconButton>
                }
                title={name}
            /**subheader="September 14, 2016"
             *  TODO : add the creation date of the list
             */
            />
            <CardMedia
                className={classes.media}
                image={GroceriesPic}
                title="Groceries"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    Expand below to see what items you need
          {/* This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like. */}
                    {/* TODO : add a progress bar to see how much items are left in % ? */}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
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
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {neededItems.map((item, idx) => {
                        return (<Typography>
                            <FormControlLabel
                                control={<GreenCheckbox checked={item.checked} onChange={(e, data) => handleChange(idx, item.checked)} />}
                                label={item.name}
                            />
                            {/* {item.name}, {item.quantity}, {item.unit} */}
                        </Typography>)
                    })}
                </CardContent>
            </Collapse>
        </Card>
    );
}
