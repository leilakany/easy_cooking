import React from 'react';
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


import RecipeList from "./RecipeList";

import axios from 'axios';


let API_KEY = process.env.REACT_APP_API_KEY;
let API_URL = "https://api.spoonacular.com/recipes/";

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
        }
    }});


class SearchMenu extends React.Component {
  constructor(props){
    super(props);
      this.state = {
          diet:'',
          query:'',
          recipes:[],
          url:''
    }
    this.handleDietChange = this.handleDietChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    }

    handleDietChange = (event) => {
      let diet = event.target.value

        if (this.state.query.localeCompare('')!==0){
            let request = API_URL+'search?number=12&apiKey='+API_KEY+'&query='+this.state.query+"&diet="+diet
            axios.get(request).then((resp) => {
            let recipes = []
            let url = resp.data.baseUri;
            recipes = resp.data.results;
            this.setState({'recipes':recipes, 'diet':diet, 'url':url})
            })
        }
        this.setState({diet:diet})
    };

    keyPress = (event) => {
      let query = event.target.value
      if(event.keyCode === 13){
        let request = API_URL+'search?number=12&apiKey='+API_KEY+'&query='+query;
        if (this.state.diet.localeCompare('')!==0) {
        request += '&diet='+this.state.diet;
        }
        axios.get(request).then((resp) => {
            let recipes = []
            let url = resp.data.baseUri;
            recipes = resp.data.results;
            this.setState({'recipes':recipes, 'url':url, 'query':query});
        })
      } 
    }
      
    render(){ 
        const { classes } = this.props;

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
            <RecipeList recipes={this.state.recipes} url={this.state.url} />
        </Grid>
        </div>
        )
        }
    }

export default withStyles(styles)(SearchMenu);