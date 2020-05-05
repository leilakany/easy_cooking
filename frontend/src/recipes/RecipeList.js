import React from 'react';

import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';


class RecipeList extends React.Component {
    constructor(props){
      super(props);
      this.state={
      }
      this.recipes = this.props.recipes;
      this.url = this.props.url;
      this.query = this.props.query;
      this.diet = this.props.diet;

    }

    componentDidMount() {

    }

    render(){ 
      this.diet = this.props.diet;
      this.recipes = this.props.recipes;
      this.url = this.props.url;
      this.query = this.props.query;

      return (
        <div>
          <Grid container direction="row" spacing={3} >
              {this.recipes.map((item, i)=>{ return <Grid item xs={3} key={item.id}><RecipeCard id={item.id} title={item.title} img={item.image} url={this.url} time={item.readyInMinutes} query={this.query} diet={this.diet}></RecipeCard></Grid>})}
        </Grid>
        </div>
      )
    ; }
  }
  
  export default RecipeList