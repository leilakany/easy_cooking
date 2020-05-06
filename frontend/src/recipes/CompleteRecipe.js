import React from 'react';
import Link from '@material-ui/core/Link';
import { searchInstructions } from './spoonacular_queries';

class CompleteRecipe extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        steps : [],
      }
  }

  componentDidMount(){
    searchInstructions(this.props.id).then((resp) => {
      this.setState({ steps : resp })
    }).catch((err) => {
      console.log(err);
    })
  }
  
  render(){
    return (
      <div>
      <Link href={"/search/&query=" + this.props.query + "&diet=" + this.props.diet}>Back to recipes</Link>
      {this.state.steps.map((item, i)=> { return <p key={i}>{item.step}</p>})}
      </div>
    )
  ; }
}

export default CompleteRecipe;
