import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

class RecipeCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    
    render(){
        this.title = this.props.title
        this.ready_in_mn = this.props.time
        this.url = this.props.url
        this.image_url = this.url+this.props.img
        const styles = 
        {
            card: {
                width: 345,
                height: 300,
            },

            media: {
                height: 0,
                paddingTop: '56.25%', // 16:9,
                marginTop:'30',
            }
        };
        return (
            <Card style={styles.card}>
            <CardHeader title={this.title}/>
            <CardMedia
                image={this.image_url}
                style={styles.media}
            />
            <CardContent></CardContent>
            </Card>
        )
    }
}

export default RecipeCard