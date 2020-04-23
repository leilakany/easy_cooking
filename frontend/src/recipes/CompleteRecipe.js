import React from 'react';
import axios from 'axios';

let API_KEY = process.env.REACT_APP_API_KEY;

class CompleteRecipe extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        steps : [],
      }
      let request = 'https://api.spoonacular.com/recipes/'+this.props.id+'/analyzedInstructions?apiKey='+API_KEY;
      console.log(request)
      axios.get(request).then((resp)=>
        this.setState({ steps : resp.data[0].steps })
      )
  }
  render(){

    return (
      <div>
      {this.state.steps.map((item, i)=> { return <p key={i}>{item.step}</p>})}
      {/* <Link href={"/search/&query="+query}>Prec</Link> */}
      </div>
    )
  ; }
}

export default CompleteRecipe;
