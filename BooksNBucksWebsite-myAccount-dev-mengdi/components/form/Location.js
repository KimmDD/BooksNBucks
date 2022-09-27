import React, {useEffect} from "react"
import {CountryDropdown, RegionDropdown} from "react-country-region-selector"

export const CountryInput = ({value, onChange, onSelect}) => {
    useEffect(() => {
        if(typeof onSelect === 'function') {
            onSelect(value)
        }
    }, [value])
    return (
        <CountryDropdown value={value} onChange={onChange} classes={'form-control'}/>
    )
}


export const StateInput = ({value, onChange, country}) => {
    return (
        <RegionDropdown value={value} onChange={onChange} country={country} classes={'form-control'}/>
    )
}
