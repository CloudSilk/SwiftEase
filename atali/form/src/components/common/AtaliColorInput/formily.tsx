import React, { useRef } from 'react'
import { Input } from 'antd'
import { usePrefix } from '@swiftease/designable-react'
import './styles.less'
import { Field } from '@formily/core'
import { ColorPicker } from 'antd';

export interface AtaliColorInputProps {
    value?: string
    field: Field
    onChange?: (color: string) => void
}

export const AtaliColorInput: React.FC<AtaliColorInputProps> = (props) => {
    const container = useRef<HTMLDivElement>()
    let prefix = usePrefix('color-input')
    if (prefix==='undefinedcolor-input') prefix = "dn-color-input"
    return (
        //@ts-ignore
        <div ref={container} className={prefix}>
            <Input
                value={props.value}
                onChange={(e) => {
                    props.onChange?.(e.target.value)
                }}
                placeholder="Color"
                prefix={
                    <ColorPicker value={props.value} onChange={(value,hex)=>{
                        props.onChange?.(hex)
                    }}></ColorPicker>
                    
                }
            />
        </div>
    )
}
