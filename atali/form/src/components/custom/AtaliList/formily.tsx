import React from 'react';
import { Avatar, List, ListProps, Skeleton } from 'antd';
import { Field, onFormValuesChange } from '@formily/core';
import { uuid } from 'uuidv4'

export interface AtaliListProps extends ListProps<string> {
    field: Field
    headerTitle: string
    defaultValue: string
    labelFieldName: string
    tempFieldName: string
    avatarFieldName: string
    descriptionFieldName: string
    contentFieldName: string
}

export interface AtaliListState {
    dataSource: any[]
}

export class AtaliList extends React.Component<AtaliListProps, AtaliListState>{
    constructor(props: AtaliListProps) {
        super(props);

        props.field.form.addEffects(props.field.address.entire, (form) => {
            onFormValuesChange((form) => {
                this.setState({ dataSource: this.props.field.value })
            })
        })

        if (props.field.value) {
            this.state = { dataSource: props.field.value }
        } else {
            this.state = { dataSource: [] }
        }
    }

    render() {
        return <>
            <List
                header={
                    <div><label>{this.props.headerTitle}</label> <a style={{ float: 'right' }} onClick={() => {
                        let dataSource = this.props.field.value
                        if (!dataSource) dataSource = []
                        if (this.props.defaultValue && this.props.defaultValue !== "") {
                            const data = JSON.parse(this.props.defaultValue)
                            data.id = uuid()
                            dataSource.push(data)
                        } else {
                            let labelFieldName = this.props.labelFieldName ?? "name"
                            const data = {
                                id: uuid()
                            }
                            data[labelFieldName] = "名称"
                            dataSource.push(data)
                        }

                        this.setState({ dataSource: dataSource })
                        this.props.field.setValue(dataSource)
                    }}>新增</a></div>
                }
                className="demo-loadmore-list"
                itemLayout="horizontal"
                bordered
                dataSource={this.props?.field.value ?? []}
                rowKey={(item:any) => {
                    return item.id
                }}
                renderItem={(item:any) => {
                    return <List.Item
                        actions={[<a key="list-loadmore-edit" onClick={
                            () => {
                                this.props.field.form.setValuesIn(this.props.tempFieldName, item)
                            }
                        }>编辑</a>, <a key="list-loadmore-more" onClick={() => {
                            let dataSource = this.state.dataSource
                            dataSource = dataSource.filter(
                                (obj, i) => item.id !== obj.id
                            )
                            this.setState({ dataSource: dataSource })
                            this.props.field.setValue(dataSource)
                        }}>删除</a>]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                avatar={
                                    item[this.props.avatarFieldName] && <Avatar src={item[this.props.avatarFieldName]} />
                                }

                                title={this.props.labelFieldName ? item[this.props.labelFieldName] : item.name}
                                description={item[this.props.descriptionFieldName] ?? ''}
                            />
                            <div>{item[this.props.contentFieldName]}</div>
                        </Skeleton>
                    </List.Item>
                }}
            >
            </List>
        </>
    }
}