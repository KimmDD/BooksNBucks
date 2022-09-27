import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/material_blue.css"
import {useState} from "react";

const DateTime = ({value, onChange}) => {
    return <Flatpickr
        onChange={value => onChange(value[0])}
        value={value?.toISOString()}
        className="form-control d-block bg-white"
        options={{enableTime: true}}/>
}
DateTime.Range = ({value, onChange, ...props}) => {
    let initial = {
        from: {
            year: value?.from?.year(),
            month: value?.from?.month() + 1,
            day: value?.from?.date(),
            hour: value?.from?.hour(),
            minute: value?.from?.minute(),
        },
        to: {
            year: value?.to?.year(),
            month: value?.to?.month() + 1,
            day: value?.to?.date(),
            hour: value?.to?.hour(),
            minute: value?.to?.minute(),
        }
    }
    const [date, setDate] = useState(initial)
    const handleChange = value => {
        console.log(value)
    }

    return (
        <>
            <Flatpickr value={[value.from, value.to]} onChange={handleChange} className="form-control d-block"
                       options={{
                           enableTime: true,
                           dateFormat: "Y-m-d H:i",
                           mode: "range",
                       }}/>
        </>
    )
}

export default DateTime