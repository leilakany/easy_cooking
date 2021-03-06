import React from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import Grid from '@material-ui/core/Grid';

import CompleteRecipe from './CompleteRecipe';
import SearchMenu from './SearchMenu';

class RecipeTab extends React.Component {

  
    render() {

      let location = this.props.location;
      const urlParams = new URLSearchParams(location.pathname);
      const id = urlParams.get('id');
      const query = urlParams.get('query');
      const diet = urlParams.get('diet');

      return (
        <Router>
        <div>
            <Grid container justify="center">
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <Switch>
                        <Route
                            path='/recipe'
                            render={(props) => <CompleteRecipe {...props} id={id} query={query} diet={diet}/>}
                        />
                        <Route
                            path='/search'
                            render={(props) => <SearchMenu {...props} query={query} diet={diet}/>}
                        />
                        <Route path="/" component={SearchMenu} />
                    </Switch>
                </Grid>
            </Grid>
        </div>
        </Router>

      );
    }
  }

export default withRouter(RecipeTab);
