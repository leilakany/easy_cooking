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
  const [state, setState] = useState({'recipes':[]});
  const [value, setValue] = React.useState(0);
  const [apiState, setApiState] = React.useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getApiState() {
    const res = await fetch("http://localhost:9000/testAPI")  
    const data = await res.text()
    setApiState(data);  
  }

  const keyPress = (event) => {
    if(event.keyCode === 13){
      axios.get('https://api.spoonacular.com/recipes/search?number=10&apiKey=d98ea6c059fb41daab9c7d8f751e086f&query='+event.target.value).then((resp) => {
            let recipes = []
            let url = resp.data.baseUri;
            recipes = resp.data.results;
            console.log(recipes)
            setState({ 'recipes' : recipes, 'url':url});
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
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <h1>Welcome to easy cooking ! </h1>
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

          <div>
          <Grid container spacing={5}>  
            {state.recipes.map((item, i)=>{ return <Grid spacing={3}><RecipeCard key={item.id} title={item.title} img={item.image} url={state.url}></RecipeCard></Grid>})}
          </Grid>
          </div>

      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}

// import React, { Component } from 'react';
// import './App.css';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab'
// import AppBar from '@material-ui/core/AppBar';


// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       apiResponse: ""
//     };
//   }

//   callAPI() {
//     fetch("http://localhost:9000/testAPI")
//       .then(res => res.text())
//       .then(res => this.setState({ apiResponse: res }))
//   }

//   componentDidMount() {
//     this.callAPI();
//   }

//   render() {
//     return(
//     <>
//     <AppBar position="static">
//       <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
//         <Tab label="Item One" {...a11yProps(0)} />
//         <Tab label="Item Two" {...a11yProps(1)} />
//         <Tab label="Item Three" {...a11yProps(2)} />
//       </Tabs>
//     </AppBar>
//       <TabPanel value={value} index={0}>
//         Item One
//     </TabPanel>
//           <TabPanel value={value} index={1}>
//             Item Two
//     </TabPanel>
//           <TabPanel value={value} index={2}>
//             Item Three
//     </TabPanel>
//     </>
//     )
//   }
// }
