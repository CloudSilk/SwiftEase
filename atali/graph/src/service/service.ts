import { Edge, Graph, Shape, Cell as X6Cell } from "@antv/x6";
import { Code } from "@swiftease/atali-pkg";
import { Cell, CellAttrs } from "@swiftease/atali-pkg";
import { nextID } from "../utils";
import { Node } from '@antv/x6'
import { defaultCache } from '@swiftease/atali-form'

export class CollapseGroup extends Node {
    private collapsed: boolean = false
    //@ts-ignore
    private expandSize: { width: number; height: number }

    protected postprocess() {
        this.toggleCollapse(false)
    }

    getExpandSize(){
        return this.expandSize;
    }

    isCollapsed() {
        return this.collapsed
    }

    toggleCollapse(collapsed?: boolean) {
        const target = collapsed == null ? !this.collapsed : collapsed
        if (target) {
            this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
            this.expandSize = this.getSize()
            this.resize(150, 32)
        } else {
            this.attr('buttonSign', { d: 'M 2 5 8 5' })
            if (this.expandSize) {
                this.resize(this.expandSize.width, this.expandSize.height)
            }
        }
        this.collapsed = target
    }
}

CollapseGroup.config({
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'rect',
            selector: 'body2',
        },
        {
            tagName: 'image',
            selector: 'icon',
        },
        {
            tagName: 'text',
            selector: 'text',
        },
        {
            tagName: 'g',
            selector: 'buttonGroup',
            children: [
                {
                    tagName: 'rect',
                    selector: 'button',
                    attrs: {
                        'pointer-events': 'visiblePainted',
                    },
                },
                {
                    tagName: 'path',
                    selector: 'buttonSign',
                    attrs: {
                        fill: 'none',
                        'pointer-events': 'none',
                    },
                },
            ],
        },
    ],
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            strokeWidth: 1,
            fill: '#ffffff',
            stroke: 'none',
        },
        body2:{
            "stroke-width": 0,
            "rx": 5,
            "ry": 5,
            "refX": "10%",
            "refY": "10%",
            "refWidth": "60%",
            "refHeight": "60%",
            "fill-opacity": 0
        },
        icon:{

        },
        text:{},
        buttonGroup: {
            refX: 8,
            refY: 8,
        },
        button: {
            height: 14,
            width: 16,
            rx: 2,
            ry: 2,
            fill: '#f5f5f5',
            stroke: '#ccc',
            cursor: 'pointer',
            event: 'node:collapse',
        },
        buttonSign: {
            refX: 3,
            refY: 2,
            stroke: '#808080',
        }
    },
})

export class CellCache {
    public groups: Record<string, Cell[]> = {};
    public groupElements: Record<string, any[]> = {};
    public cells: Map<string, Cell> = new Map<string, Cell>();
    public cellsKeyID: Map<string, Cell> = new Map<string, Cell>();
    public shapeDataSource = new Map<string, any[]>();
    public commonElements: any[] = []
    private defaultEdge?: Cell = undefined;
    private nodeFactory: Map<string, typeof Node> = new Map<string, typeof Node>()
    private edgeFactory: Map<string, Edge.Definition> = new Map<string, Edge.Definition>()
    private fileUrlPrefix: string = ""
    private collapseGroups: Map<string, boolean> = new Map<string, boolean>();

    async init(system: string, fileUrlPrefix: string) {
        this.fileUrlPrefix = fileUrlPrefix
        var resp = await defaultCache.getCellBySystem(system)
        if (resp.code === Code.Success && resp.data) {
            resp.data.forEach((cell: Cell) => {
                this.registerCell(cell)
            });
        }
    }

    registerCell(cell: Cell, test?: boolean) {
        let shapeDataSource = this.shapeDataSource[cell.propertyForm]
        if (!shapeDataSource) {
            shapeDataSource = []
            this.shapeDataSource[cell.propertyForm] = shapeDataSource
        }
        shapeDataSource.push({
            "label": cell.defaultLabel,
            "value": cell.name
        })

        this.cells.set(cell.name, cell)
        this.cellsKeyID.set(cell['id'], cell)
        if (cell.isEdge) {
            this.registerToGrapCell(cell)
            if (cell.defaultEdge) {
                this.defaultEdge = cell
            }
            return
        }
        let graphCell = this.registerToGrapCell(cell)

        if (test) return

        let group = this.groups[cell.group]
        if (!group) {
            group = []
            this.groups[cell.group] = group
        }
        group.push(cell)

        let el = this.groupElements[cell.group]
        if (!el) {
            el = []
            this.groupElements[cell.group] = el
        }

        el.push(graphCell)

        if (cell.common) {
            this.commonElements.push(graphCell?.clone())
        }
    }

    convertMarup(cell: Cell, isDefaultLabel: boolean) {
        const attrs: any[] = []
        cell.markup?.forEach(m => {
            if (m.isDefaultLabel !== isDefaultLabel) return

            let other = {}
            if (m.other && m.other !== '') {
                other = JSON.parse(m.other)
            }
            const attr: any = {
                selector: m.selector,
                tagName: m.tagName,
            }
            if (m.textContent && m.textContent !== '') {
                attr.textContent = m.textContent
            }
            if (m.children && m.children !== '') {
                attr.children = m.children
            }
            if (m.className && m.className !== '') {
                attr.className = m.className
            }
            if (m.groupSelector && m.groupSelector !== '') {
                attr.groupSelector = m.groupSelector
            }
            if (m.style && m.style !== '') {
                attr.style = m.style
            }
            if (m.selector == "icon" && cell.icon !== '') {
                attr['attrs'] = {
                    d: cell.icon
                }
            }
            attrs.push({ ...attr, ...other })
        })
        return attrs
    }

    convertAttrs(list: CellAttrs[], isDefaultLabel: boolean) {
        const attrs = {}
        list.forEach(m => {
            if (m.isDefaultLabel !== isDefaultLabel) return
            let other = {}
            if (m.other && m.other !== '') {
                try {
                    other = JSON.parse(m.other)
                } catch (error) {
                    console.log(error)
                }
            }
            const attr: any = {}
            if (m.ref && m.ref !== '') {
                attr.ref = m.ref
            }

            if (m.fill && m.fill !== '') {
                attr.fill = m.fill
            }

            if (m.stroke && m.stroke !== '') {
                attr.stroke = m.stroke
            }

            if (m.textAnchor && m.textAnchor !== '') {
                attr.textAnchor = m.textAnchor
            }

            if (m.textVerticalAnchor && m.textVerticalAnchor !== '') {
                attr.textVerticalAnchor = m.textVerticalAnchor
            }

            if (m.magnet) {
                attr.magnet = true
            }

            if (m.fontSize > 0) {
                attr.fontSize = m.fontSize
            }
            if (m["linkHref"] && m["linkHref"] !== '') {
                attr["xlinkHref"] = this.fileUrlPrefix + "/api/core/file/download?id=" + m["linkHref"]
            }

            attrs[m.name] = {
                ...attr,
                ...other
            }
        })
        return attrs
    }

    registerToGrapCell(cell: Cell) {
        const config = this.getDefaultConf(cell, true)

        switch (cell.shape) {
            case 'Rect':
                const rect = Shape.Rect.define(config)
                Graph.registerNode(cell.name, rect, true)
                this.nodeFactory.set(cell.name, rect)
                return new rect()
            case 'Circle':
                const circle = Shape.Circle.define(config)
                Graph.registerNode(cell.name, circle, true)
                this.nodeFactory.set(cell.name, circle)
                return new circle()
            case 'Edge':
                const edge = Edge.define(config)
                Graph.registerEdge(cell.name, edge, true)
                this.edgeFactory.set(cell.name, edge)
                return new edge()
            case 'Polygon':
                const polygon = Shape.Polygon.define(config)
                Graph.registerNode(cell.name, polygon, true)
                this.nodeFactory.set(cell.name, polygon)
                return new polygon()
            case 'TextBlock':
                const textBlock = Shape.TextBlock.define(config)
                Graph.registerNode(cell.name, textBlock, true)
                this.nodeFactory.set(cell.name, textBlock)
                return new textBlock()
            case "CollapseGroup":
                const collapseGroup = CollapseGroup.define(config)
                Graph.registerNode(cell.name, collapseGroup, true)
                this.nodeFactory.set(cell.name, collapseGroup)
                this.collapseGroups.set(cell.name, true)
                return new collapseGroup()
        }
        return undefined
    }

    public CreateNode2(config: any) {
        let f: any = this.nodeFactory.get(config.shape)
        if (!f) f = this.edgeFactory.get(config.shape)
        if (!f) return undefined
        return new f(config)
    }

    public CreateNode(conf: any) {
        return conf.name == "CollapseGroup" ? new CollapseGroup(conf) : new Node(conf)
    }

    createNode(shape: string, options?: any) {
        const factory = this.nodeFactory.get(shape)
        if (factory) {
            const cell = this.cells.get(shape)
            if (!cell) return undefined
            const config = this.getDefaultConf(cell, false)
            return new factory({
                ...(config ?? {}),
                id: this.nextID(cell.name),
                width: cell?.width2,
                height: cell?.height2,
                ...(options ?? {}),
            })
        }
        return undefined
    }

    nextID(shape: string, element?: any) {
        const cell = this.cells.get(shape)
        if (!cell) return nextID(undefined, element)
        return nextID(cell.idPrefix, element)
    }

    isResizing(shape: string) {
        const cell = this.cells.get(shape)
        if (!cell) return false
        return cell.resizing
    }

    isMustTarget(shape: string) {
        const cell = this.cells.get(shape)
        if (!cell) return false
        return cell.mustTarget
    }

    isMustSource(shape: string) {
        const cell = this.cells.get(shape)
        if (!cell) return false
        return cell.mustSource
    }

    getShapeDataSource(formID: string) {
        return this.shapeDataSource.get(formID)
    }

    //设置未选中时的颜色
    setUnSelectedColor(shape: string, cell: Node<Node.Properties> | Edge<Edge.Properties>) {
        const c = this.cells.get(shape)
        if (!c) return
        const text = cell.attr('text/text') as string
        Object.keys(cell.getAttrs()).forEach(key => {
            c.attrs.forEach(attrs => {
                if (key == attrs.name) {
                    cell.attr(key + '/fill', attrs.fill)
                    cell.attr(key + '/stroke', attrs.stroke)
                }
            })
        })
        cell.attr('text/text', text)
    }

    //设置未选中时的颜色
    setUnSelectedEdgeColor(shape: string, cell: Node<Node.Properties> | Edge<Edge.Properties>) {
        const c = this.cells.get(shape)
        if (!c) return
        Object.keys(cell.getAttrs()).forEach(key => {
            c.attrs.forEach(attrs => {
                if (key == attrs.name && key == "line") {
                    cell.attr(key + '/stroke', attrs.stroke)
                }
            })
        })
    }

    cloneDefaultConf(shape: string) {
        const cell = this.cells.get(shape)
        if (!cell) return {}
        return this.getDefaultConf(cell, false)
    }

    getDefaultConf(cell: Cell, isDefine: boolean) {
        let other: any = undefined
        if (cell.other && cell.other !== '') {
            try {
                other = JSON.parse(cell.other)
            } catch (error) {
                console.log(error)
            }
        }

        let ports: any = undefined
        if (cell["ports"] && cell["ports"] !== '') {
            try {
                ports = JSON.parse(cell["ports"])
            } catch (error) {
                console.log(error)
            }
        }

        let config: any = {
            markup: this.convertMarup(cell, false),
            attrs: this.convertAttrs(cell.attrs, false),
            id: cell.shape,
            name: cell.shape,
            width: cell.width,
            height: cell.height,
            label: cell.defaultLabel,
            ...(other ?? {}),
        }

        if (ports) {
            ports.items = []
            config.ports = ports
        }

        if (cell.parent) {
            config.data = {
                parent: true
            }
        }
        if (cell.isEdge) {
            if (cell.defaultLabelAttrs && cell.defaultLabelAttrs !== '') {
                try {
                    config.defaultLabel = JSON.parse(cell.defaultLabelAttrs)

                } catch (error) {
                    console.log(error)
                }
            }

            const markup = this.convertMarup(cell, true)
            if (markup.length > 0) {
                if (!config.defaultLabel) config.defaultLabel = {}
                config.defaultLabel.markup = [
                    ...(config.defaultLabel.markup ?? []),
                    ...(this.convertMarup(cell, true) ?? [])
                ]
                config.defaultLabel.attrs = {
                    ...config.defaultLabel.attrs,
                    ...(this.convertAttrs(cell.attrs, true) ?? {})
                }
            }

        }
        if (!isDefine) {
            config.shape = cell.name
        }

        return config
    }

    getPropertyFormID(shape: string) {
        const c = this.cells.get(shape)
        if (!c) return ""
        return c.propertyForm
    }

    getFormDefaultValue(shape: string) {
        const c = this.cells.get(shape)
        if (!c) return ""
        return c.formDefaultValue
    }

    getIDPrefix(shape: string) {
        const c = this.cells.get(shape)
        if (!c) return ""
        return c.idPrefix
    }

    setSize(cell: Node<Node.Properties>) {
        const c = this.cells.get(cell.shape)
        if (!c) return

        cell.setSize({
            width: c.width2,
            height: c.height2
        })
    }
    setPorts(cell: Node<Node.Properties>) {
        const c = this.cells.get(cell.shape)
        if (!c) return
        let ports: any = undefined
        if (c["ports"] && c["ports"] !== '') {
            try {
                ports = JSON.parse(c["ports"])
            } catch (error) {
                console.log(error)
            }
        }
        if (ports && ports.items) {
            cell.addPorts(ports.items)
        }
    }

    createEdge(sourceCell: X6Cell<X6Cell.Properties> | null, targetCell: X6Cell<X6Cell.Properties> | null, oldConf: any) {
        if (!sourceCell || !targetCell) return undefined
        let source = this.cells.get(sourceCell.shape)
        let target = this.cells.get(targetCell.shape)
        if (!source || !target) return undefined

        let edgeCell: any = null;
        let needSwap = false
        source.connectings?.forEach(conn => {
            if (conn.anotherCell === target?.['id']) {
                switch (conn.direct) {
                    case 2:
                        needSwap = true
                        break
                }
                const edge = this.cellsKeyID.get(conn.edge)
                if (edge) {
                    edgeCell = edge
                    return
                }
            }
        })
        if (needSwap) {
            const tempCell = targetCell
            targetCell = sourceCell
            sourceCell = tempCell
            needSwap = false
        }

        if (!edgeCell) {
            target.connectings?.forEach(conn => {
                if (conn.anotherCell === source?.['id']) {
                    switch (conn.direct) {
                        case 1:
                            needSwap = true
                            break
                    }
                    const edge = this.cellsKeyID.get(conn.edge)
                    if (edge) {
                        edgeCell = edge
                        return
                    }
                }
            })
        }

        if (needSwap) {
            const tempCell = targetCell
            targetCell = sourceCell
            sourceCell = tempCell
        }

        if (!edgeCell) {
            edgeCell = this.defaultEdge
        }
        if (!edgeCell) {
            return oldConf
        }

        const newConf = {
            ...oldConf,
            ...this.getDefaultConf(edgeCell, false),
            id: this.nextID(edgeCell.name),
        }

        if (newConf['source'].cell !== sourceCell?.["id"]) {
            const temp = newConf['source']
            newConf['source'] = newConf['target']
            newConf['target'] = temp
        }

        return newConf
    }

    newEdge(shape: string, options?: any) {
        const factory = this.edgeFactory.get(shape)
        if (!factory) return undefined
        const cell = this.cells.get(shape)
        if (!cell) return undefined
        const config = this.getDefaultConf(cell, false)
        return new factory({
            ...config,
            id: this.nextID(cell.name),
            ...(options ?? {}),
        })
    }

    setText(cell: X6Cell.Properties, text: string) {
        if (!cell.shape || cell.shape === '') return
        const c = this.cells.get(cell.shape)
        if (!c) return
        cell.attrs = cell.attrs || {}
        if (c.isEdge) {
            cell.labels = [text]
        } else {
            cell.attrs.text = {
                text: text
            }
        }
    }
}