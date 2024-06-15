import { Field } from "@formily/core";
import { Button, Form, FormInstance, Input, InputNumber, Select, Table, Tag } from "antd";
import { PlusOutlined,DeleteOutlined,MinusOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from "react";
import { ArrayBase } from "@swiftease/formily-antd-v5";
import { TreeNode } from "@swiftease/designable-core";
import { getToken } from "@swiftease/atali-pkg";
import { ReactFC, useField } from "@formily/react";
import { uuid } from "uuidv4";


interface AtaliLogicContainerProps {
    field: Field
    stylePosition: string
    styleFloat: string
    styleTop: number
    styleLeft: number
    styleRight: number
    styleBottom: number
    styleZIndex: number
    heightGap: number
    minHeight: number
    maxHeight: number
    minWidth: number
    maxWidth: number
    children: any
    // logicObjs: any[]
}
interface AtaliLogicContainerState {
    height: number
    logicObjs: any[]
}

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<any> = ({index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
        );
}

const EditableCell: React.FC<any> = ({
    editable,
    dataIndex,
    title,
    children,
    type,
    selectOptions,
    record,
    index,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const [options, setOptions] = useState<any[]>([])
    const inputRef = useRef<any>(null);
    const form = useContext(EditableContext);
    const deps = restProps?.deps;
    useEffect(() => {
        if(deps && form.getFieldValue(deps?.key)) {
            fetch(deps.url + form.getFieldValue(deps?.key), {
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + getToken(),
                },
            }).then(res => res.json())
            .then(res => {
                const data = res?.data || [];
                setOptions((((data[0] || {}).productCategoryAttributeValue )|| []).map((item: any) => {
                    item.label = item[deps.labelId];
                    item.value = item[deps.valueId];
                    return item;
                }));
            })
        }
    }, [form.getFieldValue(deps?.key)]);

    let childNode = children;   
    if(editable) {
        childNode = (
            <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                >
                    {(() => {
                        switch(type) {
                            case 'select':
                                return (
                                    <Select options={restProps?.deps ? options : selectOptions} value={record[dataIndex]} onChange={(value: any) => {
                                        form.setFieldsValue({
                                            [dataIndex]: value,
                                        });
                                        record[dataIndex] = value;
                                    }}></Select>
                                    // <DepsSelect defaultOptions={selectOptions} deps={restProps.deps} record={record}></DepsSelect>
                                )
                            case 'number':
                                return (
                                    <InputNumber ref={inputRef} value={record[dataIndex]} onChange={(value: any) => {
                                        form.setFieldsValue({
                                            [dataIndex]: value,
                                        });
                                        record[dataIndex] = value;
                                    }} />
                                )
                            case 'operation':
                                return (
                                    <DeleteOutlined onClick={() => {
                                        if(restProps.handledeleteitem) {
                                            restProps.handledeleteitem(record);
                                        }
                                    }} />
                                )
                            default: 
                                return (
                                    <Input ref={inputRef} value={record[dataIndex]} onChange={(value: any) => {
                                        form.setFieldsValue({
                                            [dataIndex]: value,
                                        });
                                        record[dataIndex] = value;
                                    }} />
                                )
                        }
                    })()}
            </Form.Item>);
        
    } else {
        childNode = (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
                {children}
            </div>
        )
    }

    return (
        <td {...restProps}>{childNode}</td>
    )
}

const LogicContainer = (props: any) => {
    const [logicObj, setLogicObj] = useState<any>(props.value || {
        tempId: uuid(),
        type: 'container',
        operator: 'or',
        children: [{
            type: 'attributes',
            tempId: uuid(),
            dataSource: [{
                key: uuid(),
                childIndex: 0,
                name: '1',
                value: '1',
            }]
        }]
    });

    const defaultColumns = [{
        title: '优先级',
        dataIndex: 'sortIndex',
        type: 'number'
    },{
        title: '产品特性',
        dataIndex: 'productAttributeID',
        type: 'select',
        selectOptions: props.allProductAttributes
    },{
        title: '运算符',
        dataIndex: 'mathOperator',
        type: 'select',
        selectOptions: [
            {
                "children": [],
                "label": "等于",
                "value": "等于"
            },
            {
                "children": [],
                "label": "不等于",
                "value": "不等于"
            },
            {
                "children": [],
                "label": "大于",
                "value": "大于"
            },
            {
                "children": [],
                "label": "大于等于",
                "value": "大于等于"
            },
            {
                "children": [],
                "label": "小于",
                "value": "小于"
            },
            {
                "children": [],
                "label": "小于等于",
                "value": "小于等于"
            },
            {
                "children": [],
                "label": "包含",
                "value": "包含"
            },
            {
                "children": [],
                "label": "不包含",
                "value": "不包含"
            },
            {
                "children": [],
                "label": "起始于",
                "value": "起始于"
            },
            {
                "children": [],
                "label": "结束于",
                "value": "结束于"
            },
            {
                "children": [],
                "label": "包括",
                "value": "包括"
            },
            {
                "children": [],
                "label": "排除",
                "value": "排除"
            }
        ]
    },{
        title: '特性值',
        dataIndex: 'attributeValue',
        type: 'select',
        deps: {
            key: 'productAttributeID',
            url: '/api/mom/productbase/productcategoryattribute/query?productAttributeID=',
            labelId: 'value',
            valueId: 'value'
        }
    },{
        title: '备注',
        dataIndex: 'remark',

    },{
        title: '操作',
        dataIndex: 'operation',
        type: 'operation',
    }];

    const columns = defaultColumns.map((col) => {
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                type: col.type,
                dataIndex: col.dataIndex,
                title: col.title,
                editable: true,
                children: [],
                selectOptions: col.selectOptions,
                deps: col.deps,
                handledeleteitem: handleDeleteItem
            }),
        }
    });

    const handleAddLogcObj = () => {
        const newLogicObj = {
            tempId: uuid(),
            type: 'container',
            operator: 'or',
            children: [{
                type: 'attributes',
                tempId: uuid(),
                dataSource: []
            }]
        }
        logicObj.children.push(newLogicObj);
        setLogicObj({...logicObj});
        if(props?.updateValue) {
            props.updateValue(logicObj);
        }
    }

    const handleAddItem = (item, index) => {
        item.dataSource = [...(item.dataSource || []), {
            key: uuid(),
            childIndex: index,
            name: '1',
            value: '1',
        }];
        setLogicObj({...logicObj});
        if(props?.updateValue) {
            props.updateValue(logicObj);
        }
    }

    const handleDeleteItem = (record) => {
        logicObj.children[record.childIndex].dataSource = (logicObj.children[record.childIndex]?.dataSource || []).filter(item => item.key !== record.key);
        setLogicObj({...logicObj});
        if(props?.updateValue) {
            props.updateValue(logicObj);
        }
    }

    const handleDeleteLogic = (index) => {
        logicObj.children = (logicObj.children || []).filter((item, cindex) => cindex !== index);
        setLogicObj({...logicObj});
        if(props?.updateValue) {
            props.updateValue(logicObj);
        }
    }
    return (
        <div style={props.style}>
            <div style={{
                padding: '0.25rem 0.625rem',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <Select style={{width: '20%'}} options={[{
                    value: 'or',
                    label: '或'
                }, {
                    value: 'and',
                    label: '与'
                }]} value={logicObj.operator} onChange={(value) => {
                    logicObj.operator = value;
                    setLogicObj({...logicObj});
                    if(props?.updateValue) {
                        props.updateValue(logicObj);
                    }
                }}></Select>

               <div>
                    <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => {
                            handleAddLogcObj();
                        }}></Button>
                    { props.handleDeleteLogic && <Button type="default" size="small" icon={<MinusOutlined />} onClick={() => {
                        props.handleDeleteLogic();
                    }}></Button>}
               </div>
            </div>
            {logicObj.children.map((item, cindex) => {
                if(item.type === 'container') {
                    return (
                        <LogicContainer key={item.tempId} value={item} style={props.style} allProductAttributes={props.allProductAttributes} updateValue={(data) => {
                            logicObj.children[cindex] = data;
                            setLogicObj({...logicObj});
                            if(props?.updateValue) {
                                props.updateValue(logicObj);
                            }
                        }} handleDeleteLogic={() => {
                            handleDeleteLogic(cindex);
                        }}></LogicContainer>
                    )
                } else {
                    return (
                        <ArrayBase disabled>
                            <Table
                                size="small"
                                bordered
                                style={{marginTop: '0.5rem'}}
                                dataSource={item.dataSource}
                                pagination={false}
                                columns={columns}
                                components={{
                                    body: {
                                        row: EditableRow,
                                        cell: EditableCell
                                    }
                                }}
                            >
                            </Table>
                            <Button style={{width: '100%', marginTop: '0.25rem'}} type="dashed" icon={<PlusOutlined />} onClick={() => {
                                handleAddItem(item, cindex);
                            }}>
                                Addition
                            </Button>
                        </ArrayBase>
                    )
                }
                
            })}
            
        </div>
    )
}

export const AtaliLogicContainerFormily: ReactFC<any> = (props: any) => {
    const [ logObj, setLogObj ] = React.useState<any[]>(props.value);
    const self = useField<Field>();
    const [ allProductAttributes, setAllProductAttributes ] = React.useState<any[]>([]);
    useEffect(() => {
        fetch('/api/mom/productbase/productattribute/all', {
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + getToken(),
            },
        })
            .then((response) => response.json())
            .then((res) => {
                setAllProductAttributes((res.data || []).map((item) => {
                    return {
                        ...item,
                        label: item.description || item.code,
                        value: item.id,
                    }
                }))
            })

    }, [])

    const additionNode = new TreeNode({
        componentName: 'Field',
        props: {
            type: 'void',
            title: 'Addition',
            'x-component': 'ArrayTable.Addition',
        },
    });

    
    
    const getHeight = (heightGap: number) => {
        if (heightGap <= 0) {
            return 0
        }
        return document.body.offsetHeight - heightGap
    }
    const style = {
        margin: 10,
        minHeight: 300,
        "borderStyle": "solid",
        "borderWidth": "1px",
        "borderColor": "rgba(221,220,226,1)",
        ...props['style'],
        float: props.styleFloat,
        position: props.stylePosition,
        top: props.styleTop,
        left: props.styleLeft,
        right: props.styleRight,
        bottom: props.styleBottom,
        maxHeight: props.maxHeight,
        minWidth: props.minWidth,
        maxWidth: props.maxWidth
    }

    return (
        <>
          <LogicContainer value={logObj} style={style} allProductAttributes={allProductAttributes} updateValue={(data) => {
            self.setValue(data);
          }} />
        </>
        
    )
}