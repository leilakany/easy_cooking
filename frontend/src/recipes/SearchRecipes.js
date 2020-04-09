import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { fade, makeStyles } from '@material-ui/core/styles';

import RecipeCard from './RecipeCard';
import Recipe from './CompleteRecipe';

let API_KEY = process.env.REACT_APP_API_KEY;

const useStyles = makeStyles(theme => ({
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
  }}));

export default function SearchRecipes() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [state, setState] = useState({'recipes':[], 'diet':'', 'query':'', 'url' : ''});

    const handleDietChange = (event) => {
        let diet = event.target.value
        if (state.query.localeCompare('')!==0){
            let request = state.query+"&diet="+diet
            axios.get(request).then((resp) => {
            let recipes = []
            let url = resp.data.baseUri;
            recipes = resp.data.results;
            setState({'recipes':recipes, 'diet':diet, 'url':url, 'query':state.query})
            })
    }
    setState({'recipes':[], 'diet':diet, 'url':'', 'query':''})
    };

      const keyPress = (event) => {
        if(event.keyCode === 13){
          let request = 'https://api.spoonacular.com/recipes/search?number=12&apiKey='+API_KEY+'&query='+event.target.value;
          if (state.diet.localeCompare('')!==0) {
            request += '&diet='+state.diet
          }
          axios.get(request).then((resp) => {
                let recipes = []
                let url = resp.data.baseUri;
                recipes = resp.data.results;
                setState({'recipes':recipes, 'url':url, 'query':request, 'diet':state.diet});
            })
          }
      }
    
      useEffect(() => {
    
      }, []);

      const BodyToHide = (props) => {
        const { location } = props;
        if (location.pathname.match('/recipe')) {
          return <h1>OUIIII</h1>;
        }
        return (
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
                      onKeyDown = {keyPress}
                    />
                    </div>
                  </div>
              </Grid>
              <Grid item xs={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Diet</FormLabel>
                <RadioGroup row aria-label="diet" name="dier1" value={value} onChange={handleDietChange}>
                  <FormControlLabel value="" control={<Radio />} label="No special diet" checked={state.diet.localeCompare('')===0}/>
                  <FormControlLabel value="vegetarian" control={<Radio />} label="Vegetarian" checked={state.diet.localeCompare('vegetarian')===0}/>
                  <FormControlLabel value="vegan" control={<Radio />} label="Vegan" checked={state.diet.localeCompare('vegan')===0}/>
                </RadioGroup>
              </FormControl>
              </Grid>
              <Grid item xs={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Ingredients</FormLabel>
                <RadioGroup row aria-label="ingredients" name="dier1" value={value}>
                  <FormControlLabel value="fridge" control={<Radio />} label="In my fridge" />
                  <FormControlLabel value="all" control={<Radio />} label="All" checked={true}/>
                </RadioGroup>
              </FormControl>
              </Grid>
              <div className={classes.root}>
              <Grid container direction="row" spacing={3} >
                    {state.recipes.map((item, i)=>{ return <Grid item xs={3} key={item.id}><RecipeCard id={item.id} title={item.title} img={item.image} url={state.url} time={item.readyInMinutes}></RecipeCard></Grid>})}
              </Grid>
              </div>
            </Grid>
        )
      }
      
      const Body = withRouter(BodyToHide);

      return (
          <Body></Body>
      )
  }
  




