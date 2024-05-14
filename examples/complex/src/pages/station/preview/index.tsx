import React from 'react'
import { Graph, Cell, Node } from '@antv/x6'
import '@antv/x6-react-shape'
import '../workmanship/index.less'
import { CellCache, CollapseGroup } from '@swiftease/atali-graph'
import { Code, CommonService } from '@swiftease/atali-pkg'
import { createSchemaField } from '@/pages/form/field'
import { Workmanship } from '../workmanship/types'
import { newService } from '@swiftease/atali-form'
import { GraphPreviewPage } from '@swiftease/atali-graph'
import { matchPath } from '@umijs/max'
interface AIoTDesignerPageState {
    workmanship?: Workmanship
    workmanshipService: CommonService<Workmanship>
    workmanshipID: string
}

export default class AIoTDesignerPage extends React.Component<any, AIoTDesignerPageState> {

    constructor(props: any) {
        super(props);
        const match = matchPath(
            { path: "/station/workmanship/preview/:workmanshipID" },
            location.hash.replace("#",""),
          );
        this.state = {
            workmanshipService: newService<Workmanship>('aiot/station/workmanship'),
            workmanshipID: match?.params?.workmanshipID
        }
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
        return <GraphPreviewPage
            fileUrlPrefix='https://hhm.xw.life'
            system='Station'
            data={this.state.workmanship}
            graphFormID='3f2c8c66-c963-4c89-8152-be2de58655a2'
            getFormID={(shape)=>{
                return "1b8a7904-ab20-47c6-95d2-0965724fbb26"
            }}
            getData={async (grapth, cellCache, collapse) => {
                await this.getData(this, grapth, cellCache, collapse)
            }}
            createSchemaField={createSchemaField}
            letCol={16} rightCol={8}
        ></GraphPreviewPage>
    }
}