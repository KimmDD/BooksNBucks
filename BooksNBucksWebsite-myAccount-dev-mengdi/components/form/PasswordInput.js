import {useState} from "react"
import {Form} from 'antd'
import {BiLockAlt, BiLockOpenAlt} from "react-icons/bi";

const PasswordInputField = ({value, onChange, prefix, placeholder}) => {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative">
            <input
                className="form-control"
                style={{paddingRight: 36}}
                type={visible ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <div className="absolute top-2.5 right-3" role="button" onClick={() => setVisible(!visible)}>
                {visible ? <BiLockOpenAlt size={18}/> : <BiLockAlt size={18}/>}
            </div>
        </div>
    )
}

const PasswordInput = ({name, label, required, min = 6, confirm = false, dependency = 'password', placeholder}) => {
    let rules = [
        {required, message: 'Please enter a password'},
        {min : confirm ? 0 : min, message: 'Password must be at least 6 characters'}
    ]
    if(confirm) {
        rules.push(({ getFieldValue }) => ({
            validator(_, value) {
                if (getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
        }))
    }

    return (
        <Form.Item name={name} label={label} rules={rules} initialValue="">
            <PasswordInputField placeholder={placeholder}/>
        </Form.Item>
    )
}
export default PasswordInput