import {Form, TimePicker} from "antd";
import moment from "moment";

const TimeRange = ({name, label, required}) => {
    let initRules = [
        {required: required, message: `Please provide ${label || 'a value'}`},
    ]
    return (
        <Form.Item name={name} label={label} rules={[...initRules]}>
            <Input/>
        </Form.Item>
    )
}
export default TimeRange


const Input = ({value, onChange}) => {
    const handleChange = value => {
        let start = value[0]?.format('HH:mm')
        let end = value[1]?.format('HH:mm')
        onChange({start, end})
    }
    return (
        <TimePicker.RangePicker
            value={value && [moment(value.start, 'HH:mm'), moment(value.end, 'HH:mm')]}
            onChange={handleChange}
            format="hh:mm a"/>
    )
}