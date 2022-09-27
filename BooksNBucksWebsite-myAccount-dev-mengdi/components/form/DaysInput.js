import {Form} from "antd";
import {useState} from "react";

const DaysInput = ({name, label, required}) => {
    let initRules = [
        {required: required, message: `Please provide ${label || 'a value'}`},
    ]
    return (
        <Form.Item name={name} label={label} initialValue={[]} rules={[...initRules]}>
            <Input/>
        </Form.Item>
    )
}

export default DaysInput

const Input = ({value, onChange}) => {
    const [update, setUpdate] = useState(false)
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const handleSelect = day => {
        let selected = value || []
        if(selected.includes(day)) {
           selected = selected.filter(selected => selected !== day)
        }else {
            selected.push(day)
        }
        onChange(selected)
        setUpdate(!update)
    }

    return (
        <div className="flex flex-wrap">
            {days?.map((day, index) => (
                <div
                    key={index}
                    role="button"
                    onClick={() => handleSelect(day)}
                    className={`px-4 py-2 mr-3 mb-3 border border-gray-600 font-semibold border-color-gray rounded-lg ${value?.includes(day) ? 'bg-primary border-danger text-white' : ''} `}>
                    {day}
                </div>
            ))}
        </div>
    )
}