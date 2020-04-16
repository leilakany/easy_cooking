import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GroceryCard from './grocery_card';

const backend_url = "http://127.0.0.1:9000/"

export default function GroceryList(){

    const [groceries, setGroceries] = useState([])

    useEffect(() => {
        let all_groceries_ep = backend_url + "grocery_list/"
        axios.get(all_groceries_ep).then(resp => {
            setGroceries(resp.data)
        })
    }, [])

    if(!groceries.length) return ""

    return(
        <div>
            {
                groceries.map((grocery_list) => {
                    return <GroceryCard items={grocery_list.items} name={grocery_list.name}></GroceryCard>
                })
            }
        </div>


    )

}
