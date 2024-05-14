import React from 'react';
import { Graph } from '@antv/x6'
import {
    ClearOutlined,
    SaveOutlined,
    UndoOutlined,
    RedoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    DeleteOutlined,
    ExportOutlined, DeploymentUnitOutlined
} from '@ant-design/icons'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import { Toolbar } from '@antv/x6-react-components'
import { Code, CommonService } from '@swiftease/atali-pkg';
import { message } from 'antd';
import { newService } from '@swiftease/atali-form';

const Item = Toolbar.Item
const Group = Toolbar.Group
interface ToolBarProps {
    graph: Graph
    data: any
    saveFn: () => void
    isBPM?: boolean
}

interface ToolBarState {
    canUndo: boolean
    canRedo: boolean
    zoom: number
    service: CommonService<any>
}

export class ToolBar extends React.Component<ToolBarProps, ToolBarState>{
    constructor(props: any) {
        super(props);
        this.state = {
            canRedo: false,
            canUndo: false,
            zoom: 1,
            service: newService('')
        }
    }

    handleClick(name: string) {
        const graph = this.props.graph

        if (!graph) return
        switch (name) {
            case 'undo':
                //@ts-ignore
                graph.undo()
                break
            case 'redo':
                //@ts-ignore
                graph.redo()
                break
            case 'deleteAll':
                graph.clearCells()
                break
            case 'delete':
                //@ts-ignore
                let cells = graph.getSelectedCells()
                if (cells.length) {
                    graph.removeCells(cells)
                }
                break
            case 'save':
                if (this.props.saveFn) {
                    this.props.saveFn()
                }
                break
            case 'zoomIn':
                graph.zoom(0.1)
                break
            case 'zoomOut':
                graph.zoom(-0.1)
                break
            case 'export':
                this.state.service?.export('/api/bpm/process/export/camunda', { id: this.props.data.id })
                break
            case 'deployment':
                this.state.service?.post('/api/bpm/camunda/deployment/create?id=' + this.props.data.id, undefined).then((res: any) => {
                    if (res.code === Code.Success) {
                        message.success("部署成功")
                    }
                })
                break
            default:
                break
        }
    }

    componentDidMount() {
        const graph = this.props.graph
        // history
        //@ts-ignore
        this.setState({ canUndo: graph.canUndo(), canRedo: graph.canRedo(), zoom: graph.zoom() })
        graph.on('graph', () => {
            //@ts-ignore
            this.setState({ canUndo: graph.canUndo(), canRedo: graph.canRedo() })
        })
        // zoom
        graph.on('scale', () => {
            this.setState({ zoom: graph.zoom() })
        })
    }

    render() {
        return (
            <div>
                {/* @ts-ignore */}
                <Toolbar hoverEffect={true} size="small" onClick={(name) => { this.handleClick(name) }}>
                    <Group>
                        <Item
                            name="deleteAll"
                            icon={<ClearOutlined />}
                            tooltip="Clear (Cmd + D, Ctrl + D)"
                        />
                        <Item
                            name="delete"
                            icon={<DeleteOutlined />}
                            tooltip="Delete (Backspace, Delete)"
                        />
                    </Group>
                    <Group>
                        <Item
                            name="zoomIn"
                            tooltip="ZoomIn (Cmd + 1, Ctrl + 1)"
                            icon={<ZoomInOutlined />}
                            disabled={this.state.zoom > 1.5}
                        />
                        <Item
                            name="zoomOut"
                            tooltip="ZoomOut (Cmd + 2, Ctrl + 2)"
                            icon={<ZoomOutOutlined />}
                            disabled={this.state.zoom < 0.5}
                        />
                        <span style={{ lineHeight: '28px', fontSize: 12, marginRight: 4 }}>
                            {`${(this.state.zoom * 100).toFixed(0)}%`}
                        </span>
                    </Group>
                    <Group>
                        <Item
                            name="undo"
                            tooltip="Undo (Cmd + Z, Ctrl + Z)"
                            icon={<UndoOutlined />}
                            disabled={!this.state.canUndo}
                        />
                        <Item
                            name="redo"
                            tooltip="Redo (Cmd + Shift + Z, Ctrl + Y)"
                            icon={<RedoOutlined />}
                            disabled={!this.state.canRedo}
                        />
                    </Group>
                    <Group>
                        <Item
                            name="save"
                            icon={<SaveOutlined />}
                            tooltip="Save (Cmd + S, Ctrl + S)"
                        />
                        {this.props.isBPM && <Item
                            name="export"
                            icon={<ExportOutlined />}
                            tooltip="Export Camunda BPMN 2.0"
                        />}
                        {this.props.isBPM && <Item
                            name="deployment"
                            icon={<DeploymentUnitOutlined />}
                            tooltip="部署流程到Camunda"
                        />}
                    </Group>
                </Toolbar>
            </div>
        );
    }
};
