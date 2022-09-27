import {Form} from "antd";
import {useState} from "react";

const DaysInput = ({name, label, required, options}) => {
    let initRules = [
        {required: required, message: `Please provide ${label || 'a value'}`},
    ]
    return (
        <Form.Item name={name} label={label} initialValue={[]} rules={[...initRules]}>
            <Input options={options}/>
        </Form.Item>
    )
}

export default DaysInput

const Input = ({value, onChange, options}) => {
    const [update, setUpdate] = useState(false)
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
            {options?.map((day, index) => (
                <div
                    key={index}
                    role="button"
                    onClick={() => handleSelect(day._id)}
                    className={`px-4 py-2 mr-3 mb-3 border border-gray-600 font-semibold border-color-gray rounded-lg ${value?.includes(day._id) ? 'bg-primary border-danger text-white' : ''} `}>
                    {day.name}
                </div>
            ))}
        </div>
    )
}