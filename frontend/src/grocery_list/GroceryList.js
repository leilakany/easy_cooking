import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GroceryCard from './GroceryCard';
import Grid from '@material-ui/core/Grid';

const backend_url = "http://127.0.0.1:9000/"


export default function GroceryList() {
    const [groceries, setGroceries] = useState([])

    useEffect(() => {
        let all_groceries_ep = backend_url + "grocery_list/"
        axios.get(all_groceries_ep).then(resp => {
            setGroceries(resp.data)
        })
    }, [])

    const removingList = (list_index) => {
        groceries.splice(list_index, 1)
        setGroceries([...groceries])
    }

    if (!groceries.length) return ""

    return (
        <Grid container direction="row" spacing={3} >
            {
                groceries.map((grocery_list, idx) => {
                    return (
                        <Grid item xs={3}>
                            <GroceryCard unmountList={removingList} idx={idx} items={grocery_list.items} db_id={grocery_list._id} name={grocery_list.name}></GroceryCard>
                        </Grid>)
                })
            }
        </Grid>
    )

}
