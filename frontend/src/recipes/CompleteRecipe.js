import React from "react";
import axios from "axios";
import IngredientList from "./IngredientList";
import Link from "@material-ui/core/Link";
import { searchInstructions } from "./spoonacular_queries";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";


let API_KEY = process.env.REACT_APP_API_KEY;

const styles = theme => ({
  title: {
    margin: theme.spacing(4, 0, 2),
  },
});

class CompleteRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      ingredients: [],
      ingredientListUrl:
        "https://api.spoonacular.com/recipes/" +
        this.props.id +
        "/ingredientWidget.json?apiKey=" +
        API_KEY,
    };
  }

  componentDidMount() {
    searchInstructions(this.props.id)
      .then((resp) => {
        this.setState({ steps: resp });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(this.state.ingredientListUrl)
      .then((resp) => {
        this.setState({ ingredients: resp.data.ingredients });
      })
      .catch((err) => {
        console.log("Can't get the ingredients ...");
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Link
          href={
            "/search/&query=" + this.props.query + "&diet=" + this.props.diet
          }
        >
          Back to recipes
        </Link>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h6" className={classes.title}>
              Steps
            </Typography>
            {this.state.steps.map((item, i) => {
              return <p key={i}>{item.step}</p>;
            })}
          </Grid>
          <Grid item xs={4}>
            <IngredientList
              ingredients={this.state.ingredients}
              recipeId={this.props.id}
            ></IngredientList>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompleteRecipe);
