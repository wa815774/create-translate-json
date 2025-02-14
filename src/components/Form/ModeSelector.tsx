import { Radio, RadioGroupProps } from "antd"

export enum Mode {
    default = 'default',
    regExp = 'regExp',
    smartling = 'smartling',
    custom = 'custom'
}

const list = [
    {
        title: '默认',
        value: Mode.default
    },
    {
        title: '正则表达式',
        value: Mode.regExp
    },
    {
        title: 'Smartling key',
        value: Mode.smartling
    },
    {
        title: '自定义key',
        value: Mode.custom
    }
]

const ModeSelector = (props: RadioGroupProps) => {
    return <Radio.Group defaultValue="default" {...props}>
        {list.map(l => (
            <Radio.Button value={l.value} key={l.value}>{l.title}</Radio.Button>
        ))}
    </Radio.Group>
}

export default ModeSelector