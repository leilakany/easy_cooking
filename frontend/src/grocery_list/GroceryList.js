import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GroceryCard from './GroceryCard';
import Grid from '@material-ui/core/Grid';

const backendUrl = "http://127.0.0.1:9000/"


export default function GroceryList() {
    const [groceries, setGroceries] = useState([])

    useEffect(() => {
        let allGroceryListEndpoint = backendUrl + "grocery_list/"
        axios.get(allGroceryListEndpoint).then(resp => {
            setGroceries(resp.data)
        })
    }, [])

    const removingList = (groceryListIndex) => {
        groceries.splice(groceryListIndex, 1)
        setGroceries([...groceries])
    }

    if (!groceries.length) return ""

    return (
        <Grid container direction="row" spacing={3} >
            {
                groceries.map((groceryList, idx) => {
                    return (
                        <Grid item xs={3}>
                            <GroceryCard unmountList={removingList} idx={idx} items={groceryList.items} databaseId={groceryList._id} name={groceryList.name}></GroceryCard>
                        </Grid>)
                })
            }
        </Grid>
    )

}
