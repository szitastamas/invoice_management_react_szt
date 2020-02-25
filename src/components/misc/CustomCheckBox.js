import React from 'react'

export const CustomCheckBox = ({ cbFor, cbMethod, className }) => {

    return (
        <div className={`custom-cb-container ${className}`} onClick={cbMethod}>
            <span className={`custom-cb-span ${cbFor ? 'cb-active' : ''}`}></span>
            <input type="checkbox" value={cbFor}/>
        </div>
    )
}

CustomCheckBox.defaultProps = {
    className: ""
}

export default CustomCheckBox;
