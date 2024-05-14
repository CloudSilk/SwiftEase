export * from './common/designer'
export * from './custom/designer'
export * from './charts/designer'
export * from './bigscreen/designer'

import { chartObject } from './charts/index'
import { bigScreenObject }from './bigscreen'

import {
    Input, Select, TreeSelect, Cascader, Radio, Checkbox,
    Slider, Rate, NumberPicker, Transfer, Password, DatePicker,
    TimePicker, Upload, Switch, Text, Card, ArrayCards, ObjectContainer,
    ArrayTable, Space, FormTab, FormCollapse, FormLayout, FormGrid, Form, Field,
} from '@swiftease/designable-formily-antd'

import { commonObject } from './common'
import { customerObject } from './custom'


export const Inputs: any = [
    Input, Password, NumberPicker, Rate, Slider, Select,
    TreeSelect, Cascader, Transfer, Checkbox, Radio, DatePicker,
    TimePicker, Upload, Switch, ObjectContainer,
]

export const Layouts = [Card, FormGrid, FormTab, FormLayout, FormCollapse, Space,]
export const Arrays = [ArrayCards, ArrayTable]
export const Displays = [Text]


export const AllDesignerComponents = {
    Form, Field, Input, Password, NumberPicker, Rate, Slider, Select, TreeSelect,
    Cascader, Transfer, Checkbox, Radio, DatePicker, TimePicker, Upload, Switch,
    ObjectContainer, Card, FormGrid, FormTab, FormLayout, FormCollapse, Space,
    ArrayCards, ArrayTable, Text,

    ...customerObject,

    ...commonObject,

    ...chartObject,
    ...bigScreenObject,
}