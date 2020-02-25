import React, { useReducer } from 'react'
import AlertContext from './AlertContext';
import AlertReducer from './AlertReducer'
import { SET_ALERT, REMOVE_ALERT } from '../reducerTypes';
import uuid from 'uuid';

export const AlertState = (props) => {

    // Alert message object = {
    //     text,
    //     msgType
    // }
    const initialState = {
        alerts: []
    };
    const [state, dispatch] = useReducer(AlertReducer, initialState)

    const setAlert = (msg) => {
        msg.id = uuid.v4();
        dispatch({
            type: SET_ALERT,
            payload: msg
        })

        setTimeout(() => {
            removeAlert(msg.id)
        }, 2000)

    }

    const removeAlert = id => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id
        })
    }

    return (
        <AlertContext.Provider value={{
            alerts: state.alerts,
            setAlert
            }}>
            {props.children}
        </AlertContext.Provider>
    )
}

export default AlertState;