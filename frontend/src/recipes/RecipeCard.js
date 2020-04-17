import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class RecipeCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
        this.id = this.props.id;
        this.title = this.props.title;
        this.ready_in_mn = this.props.time;
        this.url = this.props.url;
        this.image_url = this.url+this.props.img;
        this.query = this.props.query;
    }
    
    render(){
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
            <div>
                <Card style={styles.card}>
                    <CardActionArea href={"/recipe/&id=" + this.id } > {/*Makes card cliquable*/}
                        <CardMedia
                            image={this.image_url}
                            style={styles.media}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {this.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Ready in {this.ready_in_mn} mn
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        )
    }
}

export default RecipeCard