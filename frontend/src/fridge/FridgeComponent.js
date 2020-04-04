import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialTable, { MTableEditField } from 'material-table';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import top1000_ingredients from '../assets/spoonacular_ingredients.json'
const backend_url = "http://127.0.0.1:9000/"

export default function ClockUsingHooks() {
    const [state, setState] = useState({});
    const [tmpIngredientName, setTmpIngredientName] = useState(null)

    function postIngredient(ingredient) {
        axios.post(backend_url + 'ingredient', {
            name: ingredient.name,
            quantity: ingredient.quantity,
        })
    }

    function deleteIngredient(ingredient) {
        axios.delete(backend_url + 'ingredient/' + ingredient.id)
    }

    function modifyIngredient(ingredient) {
        axios.patch(backend_url + 'ingredient/' + ingredient.id, {
            name: ingredient.name,
            quantity: ingredient.quantity
        })
    }

    useEffect(() => {
        // Get list of existing ingredients in the fridge and
        // parse them to an object that Material-Table will read
        axios.get(backend_url + 'ingredient/').then((resp) => {
            let columns = [
                {
                    title: 'Name',
                    field: 'name',
                },
                {
                    title: 'Quantity',
                    field: 'quantity'
                }
            ]
            let data = []
            resp.data.forEach(element => {
                data.push({
                    name: element.name,
                    quantity: element.quantity,
                    id: element._id
                })
            });
            setState({ 'columns': columns, 'data': data })
        })
    }, [])

    return (
        <MaterialTable
            title="My fridge"
            columns={state.columns}
            data={state.data}
            // Override of edit field to get an autocomplete search bar
            components={{
                EditField: props => {
                    if (props.columnDef.field === "name") {
                        return <Autocomplete
                            id="combo-box-demo"
                            onChange={(event, value) => setTmpIngredientName(value)}
                            value={tmpIngredientName}
                            options={top1000_ingredients}
                            getOptionLabel={(option) => option.name}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Ingredient name" variant="outlined" />}
                        />
                    } else {
                        // Render normal component if not a ingredient
                        return <MTableEditField {...props}></MTableEditField>
                    }
                }
            }}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            newData["name"] = tmpIngredientName["name"]
                            setTmpIngredientName(null)
                            postIngredient(newData)
                            setState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            newData["name"] = tmpIngredientName["name"]
                            setTmpIngredientName(null)
                            if (oldData) {
                                modifyIngredient(newData)
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    data[data.indexOf(oldData)] = newData;
                                    return { ...prevState, data };
                                });
                            }

                        }, 600);
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            deleteIngredient(oldData)
                            setState((prevState) => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
            }}
        />
    );
}
