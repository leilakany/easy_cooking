import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';

export default function ClockUsingHooks() {
    const [state, setState] = useState({});
    const [prodId] = useState(0);

    function postProduct(product) {
        axios.post('http://127.0.0.1:9000/product', {
            name: product.name,
            quantity: product.quantity,
        })
    }

    function deleteProduct(product) {
        axios.delete('http://127.0.0.1:9000/product/'+product.id)
    }

    function modifyProduct(product) {
        axios.patch('http://127.0.0.1:9000/product/'+product.id, {
            name: product.name,
            quantity: product.quantity
        })
    }

    useEffect(() => {
        // Call API
        axios.get('http://127.0.0.1:9000/product/').then((resp) => {
            let columns = [{ title: 'Name', field: 'name'}, { title: 'Quantity', field: 'quantity'}]
            let data = []
            resp.data.forEach(element => {
                data.push( {
                    name: element.name,
                    quantity: element.quantity,
                    id: element._id
                })
            });
            setState({ 'columns' : columns, 'data': data})
        })
    }, [prodId])

    return (
        <>
        <MaterialTable
            title="My fridge"
            columns={state.columns}
            data={state.data}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
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
      </>
    );
}
