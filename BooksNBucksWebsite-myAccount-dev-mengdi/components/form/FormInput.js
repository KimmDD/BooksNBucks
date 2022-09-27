import React from "react"
import {Form} from "antd"

const FormInput = ({name, label, type = 'text', required = false, initialValue= '', rules = [], dependencies= [], isEmail, readOnly, onChange, placeholder}) => {
    let initRules = [
        {required: required, message: `Please provide ${label || 'a value'}`},
    ]
    if(isEmail === true) {
        initRules.push({type: 'email', message: 'Please enter a valid email address'})
    }
    return (
        <Form.Item
            name={name}
            label={label}
            dependencies={dependencies}
            initialValue={initialValue}
            rules={[...initRules, ...rules]}
        >
            <input type={type} readOnly={readOnly} onChange={onChange} placeholder={placeholder} className="form-control"/>
        </Form.Item>
    )
}
export default FormInput

export const HiddenFormItem = ({name, initialValue = ''}) => {
    return (
        <Form.Item name={name} initialValue={initialValue} hidden>
            <input/>
        </Form.Item>
    )
}