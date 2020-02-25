import React, { useContext, useEffect } from 'react'
import AlertContext from '../../contexts/alert/AlertContext'

export const AlertContainer = () => {
    const { alerts } = useContext(AlertContext);

    return (
        <div className="alert-container">
            {alerts.length > 0 && alerts.map(alert => {
                return (<div key={alert.id} className={`alert ${alert.msgType}`}>{alert.text}</div>)
            })}
        </div>
    )
}

export default AlertContainer;