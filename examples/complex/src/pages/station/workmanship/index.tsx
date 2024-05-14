import React from 'react'
import { Graph, Cell, Node } from '@antv/x6'
import '@antv/x6-react-shape'
import './index.less'
import { CellCache, CollapseGroup } from '@swiftease/atali-graph'
import { Menu, message } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
import { Code, CommonService } from '@swiftease/atali-pkg'
import { createSchemaField } from '@/pages/form/field'
import { Workmanship, WorkmanshipStep } from './types'
import { newService } from '@swiftease/atali-form'
import { DesignerPage } from '@swiftease/atali-graph'
import { matchPath } from '@umijs/max'
interface AIoTDesignerPageState {
    workmanship?: Workmanship
    workmanshipService: CommonService<Workmanship>
    workmanshipID: string
}

const menu = (
    <Menu onClick={(e: any) => {
        console.log('menu click ', e)
    }} style={{ width: 256 }} mode="vertical">
        <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
            <Menu.ItemGroup title="Item 1">
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
            </Menu.ItemGroup>
        </SubMenu>
        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
    </Menu>
)

export default class AIoTDesignerPage extends React.Component<any, AIoTDesignerPageState> {

    constructor(props: any) {
        super(props);
        const match = matchPath(
            { path: "/station/workmanship/designer/:workmanshipID" },
            location.hash.replace("#",""),
          );
        this.state = {
            workmanshipService: newService<Workmanship>('aiot/station/workmanship'),
            workmanshipID: match?.params?.workmanshipID
        }
    }

    cellToStep(self: AIoTDesignerPage, cell: Cell.Properties, c: Cell): WorkmanshipStep {
        let name = c.attr('text/text') as string
        if (c.isEdge()) {
            name = c.getLabelAt(0)?.attrs?.label?.text?.toString() ?? ''
        }

        const workmanshipStep: WorkmanshipStep = {
            name: name,
            id: cell.id,
            workmanshipID: self.state.workmanshipID,
            shape: cell.shape,
            zIndex: cell.zIndex,
            x: cell.position?.x,
            y: cell.position?.y,
            data: c.getData(),
            sourceCell: cell.source?.cell,
            sourceSelector: cell.source?.selector,
            targetCell: cell.target?.cell,
            targetSelector: cell.target?.selector,
            width: cell.size?.width,
            height: cell.size?.height,
            children: cell.children?.join(","),
            originPositionX: cell.originPosition?.x,
            originPositionY: cell.originPosition?.y,
            originSizeWidth: cell.originSize?.width,
            originSizeHeight: cell.originSize?.height,
            visible: cell.visible ?? true,
            markup: JSON.stringify(cell.markup),
            attrs: JSON.stringify(cell.attrs)
        }

        if (c instanceof CollapseGroup) {
            workmanshipStep.collapsed = c.isCollapsed()
            if (workmanshipStep.collapsed) {
                const size = c.getExpandSize()
                workmanshipStep.width = size.width
                workmanshipStep.height = size.height
            }
        }

        if (cell.parent) {
            workmanshipStep.parentID = cell.parent?.toString()
        }

        if (!workmanshipStep.data) {
            workmanshipStep.data = {
                id: workmanshipStep.id
            }
        } else if (workmanshipStep.data && workmanshipStep.data.id === "") {
            workmanshipStep.data.id = workmanshipStep.id
        }
        return workmanshipStep
    }

    save(self: AIoTDesignerPage, graph: Graph, cellCache: CellCache) {
        const workmanship = self.state.workmanship
        if (!workmanship || !graph) return
        const list = graph.toJSON();
        const steps: WorkmanshipStep[] = []
        list?.cells.forEach((cell) => {
            const c = graph?.getCellById(cell.id ?? '')
            if (cell.name === "CollapseGroup") {
                console.log(c)
            }
            steps.push(self.cellToStep(self, cell, c))
        })
        workmanship.workmanshipSteps = steps

        self.state?.workmanshipService?.update(workmanship).then(resp => {
            if (resp?.code != Code.Success) {
                message.error(resp?.message)
            } else {
                message.success("保存成功")
            }
        })
    }
    async getData(self: AIoTDesignerPage, graph: Graph, cellCache: CellCache, collapse: (parent: CollapseGroup, hide: boolean) => void) {
        const resp = await self.state.workmanshipService.detail(self.state.workmanshipID)
        if (resp?.code == Code.Success) {
            self.setState({ workmanship: resp.data })
            let cells: Cell.Properties[] = []
            resp.data.workmanshipSteps?.forEach(processCell => {
                if (processCell.data) {
                    processCell.data.stationID = resp.data.stationID
                    processCell.data.workmanshipID = self.state.workmanshipID
                }
                const cell: Cell.Properties = {
                    id: processCell.id,
                    shape: processCell.shape,
                    zIndex: processCell.zIndex,
                    position: {
                        x: processCell.x,
                        y: processCell.y
                    },
                    source: {
                        cell: processCell.sourceCell,
                        selector: processCell.sourceSelector
                    },
                    originPosition: {
                        x: processCell.originPositionX,
                        y: processCell.originPositionY
                    },
                    originSize: {
                        width: processCell.originSizeWidth,
                        height: processCell.originSizeHeight
                    },
                    target: {
                        cell: processCell.targetCell,
                        selector: processCell.targetSelector
                    },
                    data: processCell.data,
                    size: {
                        width: processCell.width,
                        height: processCell.height
                    },
                    children: processCell.children?.split(","),
                    parent: processCell.parentID,

                }
                
                cellCache.setText(cell, processCell.name)
                cells.push(cell)
            })
            graph.fromJSON(cells)
            // 折叠节点
            resp.data.workmanshipSteps?.forEach(processCell => {
                let c = graph.getCellById(processCell.id ?? "")
                if (c instanceof CollapseGroup && processCell.collapsed) {
                    c.toggleCollapse(processCell.collapsed)
                    collapse(c, processCell.collapsed)
                }
            })
        }
    }
    addSucess(self: AIoTDesignerPage, node: Node.Properties) {
        if (!node.data) node.data = {}
        node.data.workmanshipID = self.state.workmanshipID
    }
    render() {
        return <DesignerPage
            createMenu={(graph) => {
                return menu
            }}
            fileUrlPrefix='https://hhm.xw.life'
            system='Station'
            data={this.state.workmanship}
            graphFormID='3f2c8c66-c963-4c89-8152-be2de58655a2'
            isBPM={false}
            getData={async (grapth, cellCache, collapse) => {
                await this.getData(this, grapth, cellCache, collapse)
            }}
            save={(graph, cellCache) => {
                this.save(this, graph, cellCache)
            }}
            createSchemaField={createSchemaField}
            addSucess={(node) => {
                this.addSucess(this, node)
            }}
        ></DesignerPage>
    }
}