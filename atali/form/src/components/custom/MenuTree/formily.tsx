// @ts-nocheck
import React from 'react';
import { Tree, Switch, TreeProps, Row, Col, Button, Card } from 'antd';
import { Menu, RecursiveCall, CommonService } from '@swiftease/atali-pkg'
import { GeneralField } from '@formily/core';
import { removeAdd, newService } from '../../../utils';

export interface MenuTreeProps extends TreeProps {
    field: GeneralField
    id: number
    menuField: string
    showCheck: boolean
    showInMenu: boolean
}

export interface MenuTreeState {
    checkedKeys?: React.Key[] | {
        checked: React.Key[];
        halfChecked: React.Key[];
    },
    menus: Menu[],
    menuService: CommonService<Menu>,
    loading: boolean
}

export class MenuTree extends React.Component<MenuTreeProps, MenuTreeState>{
    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        const menuService = newService<Menu>("core/auth/menu")
        const resp = await menuService.tree()
        if (resp?.code == 20000) {
            RecursiveCall(resp.data, (t) => {
                t['key'] = t.id
                if (t['title']) {
                    t['lable'] = t['title']
                } else {
                    t['lable'] = t.name
                    t['title'] = t.name
                }
            })
            this.setState({ menuService: menuService, menus: resp.data })
        }
    }

    componentDidUpdate(prevProps: MenuTreeProps) {
        if (this.props.id == prevProps.id && this.state?.loading) {
            return
        }
        this.loadChecked()
        this.setState({ loading: true })
    }

    loadChecked() {
        if (!this.state || !this.state.menus) return
        const oldMenus = this.props.field.form.values[this.props.menuField]
        if (!oldMenus || !oldMenus.forEach) {
            this.setState({ checkedKeys: { checked: [], halfChecked: [] } })
            return
        }
        const checkedKeys: { checked: React.Key[], halfChecked: React.Key[] } = { checked: [], halfChecked: [] }
        const selectedMenus: any[] = []
        oldMenus.forEach((item: any) => {
            if (this.props.showCheck) {
                checkedKeys.checked.push(item.menuID)
            }

            const selectedMenu = {
                menuID: item.menuID,
                show: item.show,
                funcs: []
            }
            RecursiveCall(this.state.menus, (m) => {
                if (m.id == item.menuID) {
                    m.show = item.show
                }
            })
            if (item.funcs && item.funcs != "") {
                let funcs = item.funcs.split(",");
                selectedMenu.funcs = funcs
                RecursiveCall(this.state.menus, (m) => {
                    if (m.id != item.menuID) return
                    m.menuFuncs?.forEach((f) => {
                        funcs.forEach((name: any) => {
                            if (f.name == name) {
                                f.selected = true;
                            }
                        });
                    });
                });
            }
            selectedMenus.push(selectedMenu)
        });
        this.props.field.setValue(selectedMenus)
        this.setState({ checkedKeys: checkedKeys, menus: this.state.menus })
    }

    render() {
        return <Tree checkable={this.props.showCheck} {...this.props} treeData={this.state?.menus}
            key="id"
            onCheck={(checkedKeysValue: React.Key[] | {
                checked: React.Key[];
                halfChecked: React.Key[];
            }) => {
                let selectedMenus = this.props.field.value
                selectedMenus = removeAdd(checkedKeysValue.checked ?? checkedKeysValue, selectedMenus, (data1: any, data2: any) => {
                    return data1 == data2.menuID
                }, (field1Data: any) => {
                    return {
                        menuID: field1Data,
                        funcs: []
                    }
                }, (data2: any) => {
                    RecursiveCall(this.state.menus, (m) => {
                        if (m.id != data2.menuID) return
                        m.menuFuncs?.forEach((f) => {
                            f.selected = false;
                        });
                    });
                })
                this.props.field.setValue(selectedMenus)
                this.setState({ checkedKeys: checkedKeysValue })
            }
            }
            checkedKeys={this.state?.checkedKeys}
            titleRender={(node) => {
                return <div>
                    {this.props.showInMenu && !node.hidden && <><Switch checkedChildren="显示" unCheckedChildren="隐藏" size="small" checked={node.show} onChange={(checked) => {
                        node.show = checked
                        let selectedMenus = this.props.field.value
                        let found = false
                        if (!selectedMenus) selectedMenus = []
                        selectedMenus.forEach(m => {
                            if (m.menuID == node.id) {
                                found = true
                                m.show = checked
                            }
                        })
                        if (!found) {
                            selectedMenus.push({
                                menuID: node.id,
                                show: checked
                            })
                        }
                        console.log(selectedMenus)
                        this.props.field.setValue(selectedMenus)

                    }} /></>}
                    <span style={{ marginLeft: 5, fontSize: 16, fontWeight: "bold" }}>{node.title}</span>
                    {node.menuFuncs && node.menuFuncs.length > 0 && <div style={{ width: 840, marginLeft: 50 }}>

                        <div><a> 功能权限:</a><Button type="link" onClick={() => {
                            let selectedMenus = this.props.field.value
                            if (!selectedMenus) selectedMenus = []
                            const selected = []
                            node.menuFuncs.forEach((menuFunc) => {
                                selected.push(menuFunc.name)
                                menuFunc.selected = true;
                            })
                            let found = false
                            selectedMenus.forEach(m => {
                                if (m.menuID == node.id) {
                                    found = true
                                    m.funcs = selected
                                }
                            })
                            if (!found) {
                                selectedMenus.push({
                                    menuID: node.id,
                                    funcs: selected
                                })
                                let checkedKeys = this.state.checkedKeys
                                if (!checkedKeys) {
                                    checkedKeys = [node.id]
                                } else {
                                    if (checkedKeys.checked) {
                                        checkedKeys.checked.push(node.id)
                                    } else {
                                        checkedKeys.push(node.id)
                                    }
                                }
                                this.setState({ checkedKeys: checkedKeys })
                            }
                            this.props.field.setValue(selectedMenus)
                        }}>全选</Button><Button type="link" onClick={() => {
                            let selectedMenus = this.props.field.value
                            if (!selectedMenus) selectedMenus = []
                            node.menuFuncs.forEach((menuFunc) => {
                                menuFunc.selected = false;
                            })
                            let found = false
                            selectedMenus.forEach(m => {
                                if (m.menuID == node.id) {
                                    found = true
                                    m.funcs = []
                                    let checkedKeys = this.state.checkedKeys
                                    if (checkedKeys) {
                                        if (checkedKeys.checked) {
                                            checkedKeys.checked = checkedKeys.checked.filter(id => id != node.id)
                                        } else {
                                            checkedKeys = checkedKeys.filter(id => id != node.id)
                                        }
                                    }
                                    this.setState({ checkedKeys: checkedKeys.checked ?? checkedKeys })
                                }
                            })
                            if (found) {
                                selectedMenus = selectedMenus.filter(m => m.menuID != node.id)
                            }
                            this.props.field.setValue(selectedMenus)
                        }}>取消全选</Button></div>
                        <Row>
                            {node.menuFuncs.map<JSX.Element>((menuFunc) => {
                                return (
                                    <><Col span={2}>{menuFunc.title}</Col><Col span={2}><Switch checked={menuFunc.selected} key={node.id + menuFunc.name} onChange={(checked) => {
                                        menuFunc.selected = checked
                                        let selectedMenus = this.props.field.value
                                        if (!selectedMenus) selectedMenus = []
                                        let found = false
                                        selectedMenus.forEach(m => {
                                            if (m.menuID == node.id) {
                                                found = true
                                                if (checked) {
                                                    m.funcs.push(menuFunc.name)
                                                } else {
                                                    m.funcs = m.funcs.filter((obj) => obj !== menuFunc.name)
                                                }
                                            }
                                        })
                                        if (!found && checked) {
                                            selectedMenus.push({
                                                menuID: node.id,
                                                funcs: [menuFunc.name]
                                            })
                                            let checkedKeys = this.state.checkedKeys
                                            if (!checkedKeys) {
                                                checkedKeys = [node.id]
                                            } else {
                                                if (checkedKeys.checked) {
                                                    checkedKeys.checked.push(node.id)
                                                } else {
                                                    checkedKeys.push(node.id)
                                                }
                                            }
                                            this.setState({ checkedKeys: checkedKeys })
                                        }
                                        this.props.field.setValue(selectedMenus)
                                    }} checkedChildren="开启" unCheckedChildren="关闭" size="small"></Switch> </Col></>
                                )
                            })}
                        </Row>
                    </div>}
                </div>
            }}></Tree>
    }
}