import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles'

import RecipeCard from './RecipeCard';

import { searchRecipes } from './spoonacular_queries';


const styles = theme => ({
  item: {
    padding: 15,
    borderRadius: 5,
    width: '1850px',
    height: '40px',
  }
})

class RecipeList extends React.Component {
    constructor(props){
      super(props);
      this.state={
        new_recipes:[],
        offset:1,
      }
      this.loadMore = this.loadMore.bind(this)

    }

    loadMore = () => {
      searchRecipes(this.props.query, this.props.diet, this.state.offset).then((resp) => {
        this.setState({new_recipes:this.state.new_recipes.concat(resp.results)})
      }).catch((err) => {
        console.log(err);
      })
      this.setState({offset:this.state.offset+1})
    };

    render(){ 
      const { classes } = this.props;

      this.diet = this.props.diet;
      this.recipes = this.props.recipes.concat(this.state.new_recipes);
      this.url = this.props.url;
      this.query = this.props.query;

      let button;
      if (this.recipes.length > 0){
        button = <Button
                    className={classes.item}
                    variant="contained"
                    color="primary"
                    onClick = {this.loadMore}>
                    View more
                  </Button>
      }

      return (
        <div>
          <Grid container direction="row" spacing={3}>
              {this.recipes.map((item, i)=>{ return <Grid item xs={3} key={item.id}><RecipeCard id={item.id} title={item.title} img={item.image} url={this.url} time={item.readyInMinutes} query={this.query} diet={this.diet}></RecipeCard></Grid>})}
              <Grid item xs={12}>
                {button}
              </Grid>
          </Grid>
        </div>
      )
    ; }
  }
  
  export default withStyles(styles)(RecipeList)