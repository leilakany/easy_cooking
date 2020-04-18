import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialTable, { MTableEditField } from 'material-table';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import top1000_ingredients from '../assets/spoonacular_ingredients.json'

const backend_url = "http://127.0.0.1:9000/"
const baseUnits = {1:"tsp", 2:"tbs", 3:"fl oz", 4:"cup", 5: "pint", 6:"quart", 7:"gallon"
                        , 8:"ml", 9:"l", 10:"pound", 11:"ounce", 12:"mg", 13:"g", 14:"kg", 15:"mm", 16:"cm", 17:"m", 18:"inch"}

export default function Fridge() {
    const [state, setState] = useState({})
    const [tmpIngredientName, setTmpIngredientName] = useState(null)

    function postIngredient(ingredient) {
        axios.post(backend_url + 'ingredient', {
            name: ingredient.name,
            quantity: ingredient.quantity,
            api_id: ingredient.api_id,
            unit: ingredient.unit,
        })
    }

    function deleteIngredient(ingredient) {
        axios.delete(backend_url + 'ingredient/' + ingredient.id)
    }

    function modifyIngredient(ingredient) {
        axios.patch(backend_url + 'ingredient/' + ingredient.id, {
            name: ingredient.name,
            quantity: ingredient.quantity,
            api_id: ingredient.api_id,
            unit: ingredient.unit,
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
                },
                {
                    title: 'Unit',
                    field: 'unit',
                    lookup: baseUnits
                }
            ]
            let data = []
            resp.data.forEach(element => {
                data.push({
                    name: element.name,
                    quantity: element.quantity,
                    id: element._id,
                    api_id: element.api_id,
                    unit: element.unit
                })
            });
            setState({ 'columns': columns, 'data': data })
        })
    }, [])

    function newSelectedIngredient(value) {
        setTmpIngredientName(value)
    }

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
                            onChange={(event, value) => newSelectedIngredient(value)}
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
                            newData["api_id"] = tmpIngredientName["id"]
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
                            newData["api_id"] = tmpIngredientName["id"]
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
