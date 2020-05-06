import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import withStyles from '@material-ui/core/styles/withStyles';   
import {fade} from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";

import RecipeList from "./RecipeList";

import { searchRecipes } from './spoonacular_queries';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        marginLeft: theme.spacing(3),
      },
      search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      },
      searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
      },
      item: {
        padding: 15,
        borderRadius: 5,
        width: '1850px',
        height: '40px',
      }
    });


class SearchMenu extends React.Component {
  constructor(props){
    super(props);
      this.state = {
          recipes:[],
          diet:'',
          query:'',
          url:'',
          offset:1,
    }
    this.handleDietChange = this.handleDietChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.loadMore = this.loadMore.bind(this)

  }

    componentDidMount() {
      if(this.props.query){
        searchRecipes(this.props.query, this.props.diet, 0).then((resp) => {
          this.setState({
            recipes:resp.results,
            url:resp.baseUri,
          })
        }).catch((err) => {
          console.log(err);
        })
        this.setState({ query:this.props.query })
      }

      if (this.props.diet){
        this.setState({ diet:this.props.diet }
      )}

    }

    handleDietChange = (event) => {
      let diet = event.target.value
      searchRecipes(this.state.query, diet, 0).then((resp) => {
        this.setState({
          recipes:resp.results,
          url:resp.baseUri,
        })
      }).catch((err) => {
        console.log(err);
      })
      this.setState({diet:diet})
    };

    keyPress = (event) => {
      let query = event.target.value;
      if(event.keyCode === 13){
        searchRecipes(query, this.state.diet, 0).then((resp) => {
          this.setState({
            recipes:resp.results,
            url:resp.baseUri,
            query:query
          })
        }).catch((err) => {
          console.log(err);
        })
      }
    };


    loadMore = () => {
      searchRecipes(this.state.query, this.state.diet, this.state.offset).then((resp) => {
        this.setState({recipes:this.state.recipes.concat(resp.results)})
      }).catch((err) => {
        console.log(err);
      })
      this.setState({offset:this.state.offset+1})
    };
      
    render(){ 
      const { classes } = this.props;

      let button;
      if (this.state.recipes.length > 0){
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
          <Grid container spacing={3}>
          <Grid item xs={12}>
          <h1>Welcome to easy cooking ! </h1>
          </Grid>
          <Grid item xs={4}>
          <div className={classes.search}>
                  <div className={classes.searchIcon}>
                  <SearchIcon />
              </div>
              <div>
              <InputBase
                  placeholder="Search recipe"
                  classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  onKeyDown = {this.keyPress}
              />
              </div>
              </div>
          </Grid>
          <Grid item xs={4}>
          <FormControl component="fieldset">
          <FormLabel component="legend">Diet</FormLabel>
          <RadioGroup row aria-label="diet" name="dier1"  onChange={this.handleDietChange}>
              <FormControlLabel value="" control={<Radio />} label="No special diet" checked={this.state.diet.localeCompare('')===0}/>
              <FormControlLabel value="vegetarian" control={<Radio />} label="Vegetarian" checked={this.state.diet.localeCompare('vegetarian')===0}/>
              <FormControlLabel value="vegan" control={<Radio />} label="Vegan" checked={this.state.diet.localeCompare('vegan')===0}/>
          </RadioGroup>
          </FormControl>
          </Grid>
          <Grid item xs={4}>
          <FormControl component="fieldset">
          <FormLabel component="legend">Ingredients</FormLabel>
          <RadioGroup row aria-label="ingredients" name="dier1" >
              <FormControlLabel value="fridge" control={<Radio />} label="In my fridge" />
              <FormControlLabel value="all" control={<Radio />} label="All" checked={true}/>
          </RadioGroup>
          </FormControl>
          </Grid>
          <RecipeList recipes={this.state.recipes} url={this.state.url} query={this.state.query} diet={this.state.diet}/>
          <Grid item xs={12}>
          {button}
          </Grid>
      </Grid>
      </div>
      );
      }
    }

export default withRouter(withStyles(styles)(SearchMenu));