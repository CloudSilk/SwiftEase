import React, { useRef } from 'react'
import { Input, Popover } from 'antd'
import { usePrefix } from '@swiftease/designable-react'
import { SketchPicker } from 'react-color'
import './styles.less'
import { Field } from '@formily/core'

export interface AtaliColorInputProps {
    value?: string
    field: Field
    onChange?: (color: string) => void
}

export const AtaliColorInput: React.FC<AtaliColorInputProps> = (props) => {
    const container = useRef<HTMLDivElement>()
    let prefix = usePrefix('color-input')
    if (prefix==='undefinedcolor-input') prefix = "dn-color-input"
    const color = props.value as string
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
                    <Popover
                        autoAdjustOverflow
                        trigger="click"
                        overlayInnerStyle={{ padding: 0 }}
                        //@ts-ignore
                        getPopupContainer={() => container.current}
                        content={
                            <SketchPicker
                                color={color}
                                onChange={({ rgb }) => {
                                    props.onChange?.(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`)
                                }}
                            />
                        }
                    >
                        <div
                            className={prefix + '-color-tips'}
                            style={{
                                backgroundColor: color,
                            }}
                        ></div>
                    </Popover>
                }
            />
        </div>
    )
}
