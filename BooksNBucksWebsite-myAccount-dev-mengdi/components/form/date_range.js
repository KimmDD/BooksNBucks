import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import {useState} from "react";
import moment from "moment";

const DateRangeInput = ({value, onChange, className, top = false, isClear = false}) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    const handleChange = value => {
        if(!value.label) {
            let start = moment(value.startDate)
            let end = moment(value.endDate)
            value.label = `${start.format('Do, MMM')} - ${end.format('Do, MMM')}`
        }
        onChange(value)
        toggle()
    }

    return (
        <div className={`relative ${className}`}>
            <input className="form-control bg-white" value={value?.label || ''} onClick={toggle} readOnly/>
            {(value && isClear ) && <i role="button" onClick={() => onChange(undefined)} className="bx bx-x absolute right-2.5 top-3"/>}
            <div className={`absolute z-50 right-0  ${top ? 'bottom-10' : 'top-10'}`} style={{width: 710}}>
                <DateRangePicker
                    initialDateRange={value}
                    open={open}
                    toggle={toggle}
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

export default DateRangeInput