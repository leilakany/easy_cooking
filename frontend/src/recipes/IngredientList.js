import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LocalGroceryStoreTwoToneIcon from "@material-ui/icons/LocalGroceryStoreTwoTone";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function IngredienList(props) {
  const classes = useStyles();
  const [dense] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    setIngredients(props.ingredients)
  }, [props.ingredients]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes.title}>
          Ingredients
        </Typography>
        <div className={classes.paper}>
          <List dense={dense}>
            {ingredients.map((ingredient, idx) => {
              return (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {ingredient.name ? (
                        <img
                          src={
                            "https://spoonacular.com/cdn/ingredients_100x100/" +
                            ingredient.image
                          }
                          alt="new"
                        />
                      ) : (
                        <LocalGroceryStoreTwoToneIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={ingredient.name}
                    secondary={
                      ingredient.amount.metric.value +
                      " " +
                      ingredient.amount.metric.unit
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </div>
      </Grid>
    </Grid>
  );
}
