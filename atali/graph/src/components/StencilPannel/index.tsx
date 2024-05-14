import React from 'react';
import { Graph, Node } from '@antv/x6'
import '@antv/x6-react-shape'
import { EventArgs } from '@antv/x6/lib/graph/events';
import { CellCache } from '../../service/service';
import { Stencil } from '@antv/x6-plugin-stencil'

interface StencilPannelProps {
    graph: Graph
    cellCache: CellCache
    showPortLabel?: boolean
    resizeToFit?: boolean
    addSucess?: (node: Node.Properties) => void
}

interface StencilPannelState {
}

export class CustomeStencil extends Stencil {
    private cellCache?: CellCache;
    private showPortLabel?: boolean
    setCellCache(c: CellCache) {
        this.cellCache = c
    }
    enableShowPortLabel(flag?: boolean) {
        this.showPortLabel = flag
    }
    onDragStart(args: EventArgs['node:mousedown']) {
        const { e, node } = args
        const tempNode = node.clone()
        if (!tempNode) return
        this.cellCache?.setSize(tempNode)
        if (this.showPortLabel)
            this.cellCache?.setPorts(tempNode)
        this.dnd.start(tempNode, e)
    }
}

export class StencilPannel extends React.Component<StencilPannelProps, StencilPannelState>{
    // @ts-ignore
    private stencilContainer: HTMLDivElement
    getDragNode(sourceNode: Node) {
        const newCellConf = sourceNode.toJSON()
        newCellConf.markup = sourceNode.markup ?? undefined
        newCellConf.attrs = sourceNode.attrs ?? undefined
        newCellConf.id = this.props.cellCache.nextID(sourceNode.shape, sourceNode)
        let formDefaultValue = this.props.cellCache.getFormDefaultValue(sourceNode.shape);
        if (!newCellConf.data) newCellConf.data = {}
        let values = JSON.parse(formDefaultValue || "{}")
        newCellConf.data = { ...newCellConf.data, ...(values || {}) }

        this.props.addSucess && this.props.addSucess(newCellConf)
        const node = this.props.cellCache.CreateNode(newCellConf)// newCellConf.shape == "Loop" ? new CollapseGroup(newCellConf) : new Node(newCellConf)
        return node
    }

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        const groups: any[] = [
            {
                name: 'common',
                title: '常用',
                graphPadding: 1,
                graphHeight: 500,
                collapsed: false,
            },
        ]
        if (this.props.cellCache)
            Object.keys(this.props.cellCache?.groups).forEach(key => {
                groups.push({
                    name: key,
                    title: key,
                    collapsed: true,
                    graphHeight: 500
                })
            })
        const stencil = new CustomeStencil({
            title: '组件面板',
            target: this.props.graph,
            search(cell, keyword) {
                return cell.shape.indexOf(keyword) !== -1 || cell['label']?.includes(keyword)
            },
            placeholder: '根据名称搜索',
            notFoundText: '找不到',
            collapsable: true,
            getDragNode: (sourceNode: Node) => {
                return this.getDragNode(sourceNode)
            },
            getDropNode: (sourceNode: Node) => {
                return this.getDragNode(sourceNode)
            },
            stencilGraphWidth: 220,
            stencilGraphHeight: 140,
            stencilGraphPadding: 1,
            groups: groups,
            layoutOptions: {
                resizeToFit: this.props.resizeToFit
            }
        })
        stencil.setCellCache(this.props.cellCache)
        stencil.enableShowPortLabel(this.props.showPortLabel)
        this.stencilContainer?.appendChild(stencil.container)
        stencil.load(this.props.cellCache.commonElements, 'common')

        if (this.props.cellCache)
            Object.keys(this.props.cellCache.groupElements).forEach(key => {
                stencil.load(this.props.cellCache.groupElements[key], key)
            })
    }

    refStencil = (container: HTMLDivElement) => {
        this.stencilContainer = container
    }

    render() {
        return (
            <div className="app-stencil" ref={this.refStencil} />
        );
    }
};
