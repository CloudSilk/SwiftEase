export const metaSchema = {
    type: 'object',
    title: '数据元信息',
    'x-decorator': 'FormItem',
    'x-component': 'DrawerSetter',
    'x-component-props': {
        text: '设置数据元信息',
    },
    properties: {
        alias: {
            type: 'string',
            title: '字段别名',
            'x-decorator': 'FormItem',
            'x-component': 'Input'
        },
        formatter: {
            type: 'string',
            title: '格式化处理',
            'x-decorator': 'FormItem',
            'x-component': 'AtaliValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
                noCheck: true
            },
        },
        values: {
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            title: '值字段',
            description: '枚举该字段下所有值',
            items: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                    sort: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.SortHandle',
                    },
                    input: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                    },
                    remove: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.Remove',
                    },
                },
            },
            properties: {
                add: {
                    type: 'void',
                    title: '添加字段',
                    'x-component': 'ArrayItems.Addition',
                },
            },
        },
        range: {
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            title: '映射区间',
            description: '字段的数据映射区间，默认为[0,1]',
            items: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                    sort: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.SortHandle',
                    },
                    input: {
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                    },
                    remove: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.Remove',
                    },
                },
            },
            properties: {
                add: {
                    type: 'void',
                    title: '添加区间',
                    'x-component': 'ArrayItems.Addition',
                },
            },
        },
    }
}
export const styleSchema = {
    type: 'object',
    title: '设置样式',
    'x-decorator': 'FormItem',
    'x-component': 'DrawerSetter',
    'x-component-props': {
        text: '设置样式',
    },
    properties: {
        fill: {
            type: 'string',
            title: '填充色',
            'x-decorator': 'FormItem',
            'x-component': 'ColorInput'
        },
        r: {
            type: 'number',
            title: '半径大小',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        fillOpacity: {
            type: 'number',
            title: '透明度',
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
                "defaultValue": 100
            }
        },
        stroke: {
            type: 'string',
            title: '描边',
            'x-decorator': 'FormItem',
            'x-component': 'ColorInput'
        },
        lineWidth: {
            type: 'number',
            title: '描边的宽度',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        lineDash: {
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            title: '描边虚线配置',
            items: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                    sort: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.SortHandle',
                    },
                    input: {
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                    },
                    remove: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.Remove',
                    },
                },
            },
            properties: {
                add: {
                    type: 'void',
                    title: '添加配置',
                    'x-component': 'ArrayItems.Addition',
                },
            },
        },
        lineOpacity: {
            type: 'number',
            title: '描边透明度',
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
                "defaultValue": 100
            }
        },
        opacity: {
            type: 'number',
            title: '整体透明度',
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
                "defaultValue": 100
            }
        },
        shadowColor: {
            type: 'string',
            title: '阴影颜色',
            'x-decorator': 'FormItem',
            'x-component': 'ColorInput'
        },
        strokeOpacity: {
            type: 'number',
            title: '边框透明度',
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
                "defaultValue": 100
            }
        },
        shadowBlur: {
            type: 'number',
            title: '高斯模糊系数',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        shadowOffsetX: {
            type: 'number',
            title: '阴影水平距离',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        shadowOffsetY: {
            type: 'number',
            title: '阴影垂直距离',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        cursor: {
            type: 'string',
            title: '鼠标样式',
            enum: ["default"],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                "defaultValue": "default"
            },
        },
    }
}
export const pointSchema = {
    type: 'object',
    title: '数据点',
    'x-decorator': 'FormItem',
    'x-component': 'DrawerSetter',
    'x-component-props': {
        text: '设置数据点样式',
    },
    properties: {
        color: {
            type: 'string',
            title: 'color',
            'x-decorator': 'FormItem',
            'x-component': 'ColorInput'
        },
        size: {
            type: 'number',
            title: 'size',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        shape: {
            type: 'string',
            title: 'shape',
            enum: ["diamond"],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                "allowClear": true,
            }
        },
        style: styleSchema
    },
}

export const chartContainerSchema = {
    width: {
        type: 'number',
        title: '图表宽度',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        description: '设置图表宽度'
    },
    height: {
        type: 'number',
        title: '图表高度',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        description: '设置图表高度'
    },
    autoFit: {
        type: 'boolean',
        title: '自适应容器',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
    },
    appendPaddings: {
        type: 'array',
        'x-component': 'BoxStyleSetter',
        'x-decorator': '',
        title: '额外内间距',
        description: '在 padding 的基础上，设置额外的 padding 数值'
    },
    pixelRatio: {
        type: 'number',
        title: '像素比',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        description: '设置图表渲染的像素比'
    },
    limitInPlot: {
        type: 'boolean',
        title: '是否剪切',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        description: '是否对超出坐标系范围的 Geometry 进行剪切'
    },
    supportCSSTransform: {
        type: 'boolean',
        title: 'CSS Transform',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
    },
}

export const dataSchema = {
    xField: {
        type: 'string',
        title: '横坐标字段',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        description: '横向的坐标轴对应的字段'
    },
    yField: {
        type: 'string',
        title: '纵坐标字段',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        description: '纵向的坐标轴对应的字段'
    },
    seriesField: {
        type: 'string',
        title: '分组字段',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
    },
    meta: metaSchema
}

export const graphicStylesSchema = {
    smooth: {
        type: 'boolean',
        title: '曲线是否平滑',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
    },
    stack: {
        type: 'boolean',
        title: '折线堆叠',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        description: '对于存在 seriesField 分组字段的情况，我们可以设置 stack = true，让折线堆叠累加起来。'
    },
    stepType: {
        type: 'string',
        title: '阶梯类型',
        enum: ["hv", "vh", "hvh", "vhv"],
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
            "allowClear": true
        },
    },
    connectNulls: {
        type: 'boolean',
        title: '连接空数据',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        description: '对于折线图中缺失的值，是否连接空数据为一条线，或者折线断开。'
    },
}

export const reflectSchema = {
    type: 'string',
    title: '轴镜像反转',
    enum: ['x', 'y'],
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    'x-component-props': {
        "allowClear": true,
        "mode": "multiple"
    }
}


export const areaSchema = {}

export const titleSchema = {
    type: 'object',
    title: '标题配置',
    'x-decorator': 'FormItem',
    'x-component': 'DrawerSetter',
    'x-component-props': {
        text: '标题的配置项',
    },
    properties: {
        text: {
            type: 'string',
            title: '坐标轴标题',
            'x-decorator': 'FormItem',
            'x-component': 'Input'
        },
        position: {
            type: 'string',
            title: '轴标题位置',
            enum: ["start", "center", "end"],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                "defaultValue": "center"
            },
        },
        offset: {
            type: 'number',
            title: '与坐标轴距离',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        spacing: {
            type: 'number',
            title: '与坐标轴文本距离',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        style: styleSchema,
        autoRotate: {
            type: 'boolean',
            title: '自动旋转',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
                "defaultValue": true
            },
        },
        rotation: {
            type: 'number',
            title: '自动旋转角度',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
    }
}

export const labelSchema = {
    type: 'object',
    title: '文本标签',
    'x-decorator': 'FormItem',
    'x-component': 'DrawerSetter',
    'x-component-props': {
        text: '文本标签配置项',
    },
    properties: {
        type: {
            type: 'string',
            title: '类型',
            enum: ["inner", "outer", "spider"],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
        },
        offset: {
            type: 'number',
            title: '偏移量',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        offsetX: {
            type: 'number',
            title: 'X方向偏移量',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        offsetY: {
            type: 'number',
            title: 'Y方向偏移量',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        content: {
            type: 'string',
            title: '文本内容',
            'x-decorator': 'FormItem',
            'x-component': 'Input'
        },
        style: styleSchema,
        autoRotate: {
            type: 'boolean',
            title: '自动旋转',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
                "defaultValue": true
            },
        },
        rotation: {
            type: 'number',
            title: '自动旋转角度',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        labelLine: {
            type: 'boolean',
            title: '连接线样式',
            'x-decorator': 'FormItem',
            'x-component': 'AtaliValueInput',
            'x-component-props': {
                include: ['BOOLEAN', 'EXPRESSION'],
                noCheck: true
            },
        },
        labelEmit: {
            type: 'boolean',
            title: '放射状显示',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            description: '只对极坐标下的文本生效'
        },
        layout: {
            type: 'string',
            title: '布局类型',
            enum: ["overlap", "fixedOverlap", "limitInShape"],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                "allowClear": true,
                "mode": "multiple"
            }
        },
        position: {
            type: 'string',
            title: '相对位置',
            enum: ["top", "bottom", "left", "right"],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            description: '只对 geometry 为 interval 的柱条形图生效'
        },
        formatter: {
            type: 'string',
            title: '格式化函数',
            'x-decorator': 'FormItem',
            'x-component': 'AtaliValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
                noCheck: true
            },
        },
        autoHide: {
            type: 'boolean',
            title: '自动隐藏',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
    }
}

export function createAxisSchema(title?: string) {
    return {
        type: 'object',
        title: title ?? '轴配置',
        'x-decorator': 'FormItem',
        'x-component': 'DrawerSetter',
        'x-component-props': {
            text: title ?? '轴配置',
        },
        properties: {
            top: {
                type: 'boolean',
                title: '渲染在画布顶层',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
                'x-component-props': {
                    "defaultValue": true
                },
            },
            position: {
                type: 'string',
                title: '轴标题位置',
                enum: ["top", "bottom", "left", "right"],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
            },
            title: titleSchema,
            shapeStyle: {
                ...styleSchema,
                title: '形状样式'
            }
        }
    }
}