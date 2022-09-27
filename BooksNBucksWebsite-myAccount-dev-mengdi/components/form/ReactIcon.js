import {Modal, Tabs} from "antd";
import {useState} from "react";
import reactIcons from '../../constants/react-icons.json'

const ReactIconsSelector = ({value, onChange, filter}) => {
    const icons = require('react-icons/all')
    const [visible, setVisible] = useState(false)
    const onClose = () => {
        setVisible(false)
    }
    const onSelect = value => {
        onChange(value)
        onClose()
    }
    let Icon = icons[value]
    return (
        <>
            <Modal width={1200} wrapClassName="react-icon-modal" title="Icons" visible={visible} onCancel={onClose} footer={null}>
                <Tabs defaultActiveKey={0}>
                    {reactIcons?.filter(icon => !filter || filter.includes(icon.value)).map((icon, key) => (
                        <Tabs.TabPane tab={icon.name} key={key}>
                            <div className="flex flex-wrap">
                                {icon.icons.map((key, index) => {
                                    let Icon = icons[key]
                                    if(Icon) {
                                        return <Icon key={index} role="button" onClick={() => onSelect(key)} size={32} className="m-4"/>
                                    }
                                    return <></>
                                })}
                            </div>
                        </Tabs.TabPane>
                    ))}
                </Tabs>

            </Modal>
            <div className="tw-w-12 tw-h-12" role="button" onClick={() => setVisible(true)}>
                {Icon ? <Icon size={32}/> : <span className="tw-absolute tw-bg-gray-200 p-2">Select Icon</span>}
            </div>
        </>

    )
}
export default ReactIconsSelector

export const ReactIcon = ({icon, ...props}) => {
    const icons = require('react-icons/all')
    let Icon = icons[icon]
    if(Icon) {
        return <Icon {...props}/>
    }
    return <></>
}

const IconGenerator = () => {
    const iconNames = [
        {name: 'Ant Design', value: 'Ai', icons: []},
        {name: 'Bootstrap', value: 'Bs', icons: []},
        {name: 'BoxIcons', value: 'Bi', icons: []},
        {name: 'Devicons', value: 'Di', icons: []},
        {name: 'Devicons', value: 'Di', icons: []},
        {name: 'Feather Icons', value: 'Fi', icons: []},
        {name: 'Font Awesome', value: 'Fa', icons: []},
        {name: 'Game Icons', value: 'Gi', icons: []},
        {name: 'Github Octicons', value: 'Go', icons: []},
        {name: 'Grommet-Icons', value: 'Gr', icons: []},
        {name: 'Heroicons', value: 'Hi', icons: []},
        {name: 'IcoMoon Free', value: 'Im', icons: []},
        {name: 'Material Design icons', value: 'Md', icons: []},
        {name: 'Remix Icon', value: 'Ri', icons: []},
        {name: 'Simple Icons', value: 'Si', icons: []},
        {name: 'Typicons', value: 'Ti', icons: []},
        {name: 'VS Code Icons', value: 'Vsc', icons: []},
        {name: 'Weather Icons', value: 'Wi', icons: []},
        {name: 'css.gg', value: 'Cg', icons: []},
    ]
    const icons = require('react-icons/all')
    Object.keys(icons).map(key => {
        iconNames.forEach((name, index) => {
            if(key.indexOf(name.value) === 0) {
                name.icons.push(key)
            }
        })
    })
    console.log(JSON.stringify(iconNames))
}