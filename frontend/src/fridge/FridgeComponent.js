import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialTable, { MTableEditField } from 'material-table';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import top1000_ingredients from '../assets/spoonacular_ingredients.json'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function ClockUsingHooks() {
    const [state, setState] = useState({});
    const [prodId] = useState(0);
    const classes = useStyles();
    const [tmpIngredientName, setTmpIngredientName] = useState(null)

    function postProduct(product) {
        axios.post('http://127.0.0.1:9000/product', {
            name: product.name,
            quantity: product.quantity,
        })
    }

    function deleteProduct(product) {
        axios.delete('http://127.0.0.1:9000/product/' + product.id)
    }

    function modifyProduct(product) {
        axios.patch('http://127.0.0.1:9000/product/' + product.id, {
            name: product.name,
            quantity: product.quantity
        })
    }

    useEffect(() => {
        // Get list of existing ingredients in the fridge and
        // parse them to an object that Material-Table will read
        axios.get('http://127.0.0.1:9000/product/').then((resp) => {
            let columns = [
                {
                    title: 'Name',
                    field: 'name',
                },
                {
                    title: 'Quantity', field: 'quantity'
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
    }, [prodId])

    return (
        <MaterialTable
            title="My fridge"
            columns={state.columns}
            data={state.data}
            // Override of edit field to get an autocomplete search bar
            components={{
                EditField: props => {
                    if (props.columnDef.field === "name") {
                        console.log("PROPS : ", props)
                        return <Autocomplete
                            id="combo-box-demo"
                            onChange={(event, value) => setTmpIngredientName(value)}
                            value={tmpIngredientName}
                            options={top1000_ingredients}
                            getOptionLabel={(option) => option.ingredient}
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
                            newData["name"] = tmpIngredientName["ingredient"]
                            setTmpIngredientName(null)
                            postProduct(newData)
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
                            newData["name"] = tmpIngredientName["ingredient"]
                            setTmpIngredientName(null)
                            if (oldData) {
                                modifyProduct(newData)
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
                            deleteProduct(oldData)
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
