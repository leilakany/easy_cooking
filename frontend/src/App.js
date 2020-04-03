import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import RecipeCard from './RecipeCard';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import ClockUsingHooks from './fridge/FridgeComponent';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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


export default function App() {
  const classes = useStyles();
  const [state, setState] = useState({'recipes':[], 'diet':'', 'query':'', 'url' : ''});
  const [value, setValue] = React.useState(0);
  const [apiState, setApiState] = React.useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDietChange = (event) => {
    let prev = state;
    let diet = event.target.value
    if (state.query.localeCompare('')!==0){
      let request = state.query+"&diet="+diet
      axios.get(request).then((resp) => {
        let recipes = []
        let url = resp.data.baseUri;
        recipes = resp.data.results;
        // let prev = state;
        // prev['recipes'] = recipes;
        // prev['url'] = url;
        // setState(prev);
        setState({'recipes':recipes, 'diet':diet, 'url':url, 'query':state.query})
      })
    }
    setState({'recipes':[], 'diet':diet, 'url':'', 'query':''})
  };

  async function getApiState() {
    const res = await fetch("http://localhost:9000/testAPI")  
    const data = await res.text()
    setApiState(data);  
  }

  const keyPress = (event) => {
    if(event.keyCode === 13){
      let request = 'https://api.spoonacular.com/recipes/search?number=12&apiKey=d98ea6c059fb41daab9c7d8f751e086f&query='+event.target.value;
      if (state.diet.localeCompare('')!==0) {
        request += '&diet='+state.diet
      }
      axios.get(request).then((resp) => {
            let recipes = []
            let url = resp.data.baseUri;
            recipes = resp.data.results;
            // let prev = state
            // prev['recipes'] = recipes;
            // prev.url=url;
            // prev.query=request;
            // console.log(prev);
            setState({'recipes':recipes, 'url':url, 'query':request, 'diet':state.diet});
        })
      }
  }

  useEffect(() => {
    getApiState()
  }, []);


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Fridge" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
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
            <FormControlLabel value="" control={<Radio />} label="No special diet" checked={state.diet.localeCompare('')==0}/>
            <FormControlLabel value="vegetarian" control={<Radio />} label="Vegetarian" checked={state.diet.localeCompare('vegetarian')==0}/>
            <FormControlLabel value="vegan" control={<Radio />} label="Vegan" checked={state.diet.localeCompare('vegan')==0}/>
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
        <Grid container direction="row"> 
              {state.recipes.map((item, i)=>{ return <Grid item xs={3} key={item.id}><RecipeCard title={item.title} img={item.image} url={state.url}></RecipeCard></Grid>})}
        </Grid>
        </div>
      </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ClockUsingHooks></ClockUsingHooks>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}
