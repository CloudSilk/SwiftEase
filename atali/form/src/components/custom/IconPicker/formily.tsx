import { createFromIconfontCN } from '@ant-design/icons';
import { Select } from 'antd';
import { icons } from './icons'
import React from 'react'
export const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2590742_729agyh0ndx.js', // 在 iconfont.cn 上生成
});

export const MyIconPicker: React.FC = (props) => {
    return <Select {...props}>
        {icons.map(item => (
            <Select.Option key={item.key} value={item.key}><MyIcon type={item.key} /> {item.label}</Select.Option>
        ))}
    </Select>
}