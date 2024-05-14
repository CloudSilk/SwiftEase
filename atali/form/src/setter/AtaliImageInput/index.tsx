import React from 'react'
import { InputProps } from 'antd/lib/input'
import { Input, Upload, Image } from 'antd'
import { usePrefix, IconWidget } from '@swiftease/designable-react'

import cls from 'classnames'
import './styles.less'
import { getToken } from "@swiftease/atali-pkg"
export interface AtaliImageInputProps extends Omit<InputProps, 'onChange'> {
    value?: string
    onChange?: (value: string) => void
}

export const AtaliImageInput: React.FC<AtaliImageInputProps> = ({
    className,
    style,
    ...props
}) => {
    const prefix = usePrefix('image-input')
    return (
        <div className={cls(prefix, className)} style={style}>
            <Input
                {...props}
                onChange={(e) => {
                    props.onChange?.(e?.target?.['value'])
                }}
                prefix={
                    <Upload
                        action={'/api/core/file/upload'}
                        headers={{ 'authorization': 'Bearer ' + getToken() }}
                        itemRender={() => null}
                        maxCount={1}
                        onChange={(params: any) => {
                            const response = params.file?.response
                            console.log(response)
                            const url = response?.fileID
                            if (!url) return
                            props.onChange?.("/api/core/file/download?id=" + url)
                        }}
                    >
                        <IconWidget infer="CloudUpload" style={{ cursor: 'pointer' }} />
                    </Upload>
                }
            />
            <Image src={props.value} style={{ width: 32 }}></Image>
        </div>
    )
}