import React from 'react'
import { Graph, Cell, Model, Edge, Node } from '@antv/x6'
import '@antv/x6-react-shape'
import './index.less'
import { SplitBox } from '@antv/x6-react-components'
import { ConfigPannel,ToolBar, StencilPannel, ContextMenuTool } from '../components'
import { CellCache, CollapseGroup } from '../service/service'
import { globalConfig } from '../utils'
import { History } from '@antv/x6-plugin-history'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Transform } from '@antv/x6-plugin-transform'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Selection } from '@antv/x6-plugin-selection'
import { MiniMap } from '@antv/x6-plugin-minimap'

export const BPMGroupID = 'BPMGroup'
interface DesignerPageProps {
  createMenu?: (graph:Graph)=>JSX.Element
  fileUrlPrefix: string
  system: string
  data: any
  graphFormID: string
  isBPM: boolean
  gapHeight?: number
  getData?: (graph: Graph, cellCache: CellCache, collapse: (parent: CollapseGroup, hide: boolean) => void) => Promise<void>
  save?: (graph: Graph, cellCache: CellCache) => void
  addSucess?: (node: Node.Properties) => void
  validateEdge?: (graph: Graph, cellCache: CellCache, args: {
    edge: Edge<Edge.Properties>;
    type: Edge.TerminalType;
    previous: Edge.TerminalData;
  }) => boolean
  validateConnection?: (sourceCell: any, targetCell: any, graph?: Graph) => boolean
  createSchemaField: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
}

interface DesignerPageState {
  graph?: Graph
  selectCell?: Cell
  selectedNode?: Node
  selectedEdge?: Edge
  height: number | string
  cellCache: CellCache
}

const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    padding: 3,
    attrs: {
      strokeWidth: 3,
      stroke: '#52c41a',
    },
  },
}

const collapse = (parent: CollapseGroup, hide: boolean) => {
  const cells = parent.getChildren()
  if (cells) {
    //通过先移除Edge然后再加回来的方式解决展开是直接卡死问题
    //TODO 现在会出现移动导致CollapseGroup大小被还原了
    let edges: any[] = []
    cells.forEach((cell) => {
      if (cell instanceof Edge) {
        edges.push(cell)
        if (hide) {
          cell.hide()
        }
        parent.removeChild(cell)
      }
    })

    cells.forEach((cell) => {
      if (cell instanceof Edge) return
      if (hide) {
        cell.hide()
      } else {
        cell.show()
      }

      if (cell instanceof CollapseGroup) {
        collapse(cell, hide)
      }
    })

    edges.forEach((cell) => {
      parent.addChild(cell)
      if (hide) {
        cell.hide()
      } else {
        cell.show()
      }
    })
  }
}

function getHeight(gapHeight: number) {
  return document.body.offsetHeight - gapHeight
}
export class DesignerPage extends React.Component<DesignerPageProps, DesignerPageState> {
  private container: HTMLDivElement | undefined
  private minimapContainer: HTMLDivElement | undefined

  constructor(props: any) {
    super(props);
  }

  resizeFn(d: DesignerPage) {
    return () => {
      d.setState({ height: getHeight(d.props.gapHeight ?? 0) })
    }
  }

  validateConnection(sourceCell: any, targetCell: any, graph?: Graph) {
    //node之间只能有一条连线
    //TODO 限制只能是同级的节点互相连接，例如子流程1中的节点1不能直接连接到子流程2中的节点1，只能是子流程1连接子流程2
    if (sourceCell) {
      const edges = graph?.getConnectedEdges(sourceCell)
      let exists = false
      edges?.forEach((edge) => {
        const sourceID = edge.getSourceCellId();
        const targetID = edge.getTargetCellId();
        if ((sourceID == sourceCell.id && targetID == targetCell?.id) || (sourceID == targetCell?.id && targetID == sourceCell.id)) {
          exists = true;
          return false;
        }
      })
      return !exists
    }
    //TODO 如何避免死循环?
    return true
  }

  validateEdge(graph: Graph, cellCache: CellCache, args: {
    edge: Edge<Edge.Properties>;
    type: Edge.TerminalType;
    previous: Edge.TerminalData;
  }) {
    let sourceCell = args.edge.getSourceCell()
    let sourceParent: Cell<Cell.Properties> | null = null
    let targetCell = args.edge.getTargetCell()
    let targetParent: Cell<Cell.Properties> | null = null

    if (sourceCell?.shape == BPMGroupID || targetCell?.shape == BPMGroupID) {
      return false
    }
    //如果sourceCell和targetCell不在同一个子流程中
    const cells = graph.getCells()
    cells.forEach(cell => {
      cell.eachChild(child => {
        if (child.id == sourceCell?.id) {
          sourceParent = cell
        } else if (child.id == targetCell?.id) {
          targetParent = cell
        }
      })
    })
    if (sourceParent?.['id'] != targetParent?.['id']) {
      return false
    }

    const newConf = cellCache.createEdge(sourceCell, targetCell, args.edge.toJSON())

    if (cellCache.isMustTarget(sourceCell?.shape ?? '') || cellCache.isMustSource(targetCell?.shape ?? '')) {
      newConf['source'].cell = targetCell?.id
      newConf['target'].cell = sourceCell?.id
    }

    const newEdge = new Edge(newConf)
    newEdge.setConnector('jumpover')
    graph.addEdge(newEdge)
    return false
  }

  async componentDidMount() {
    //TODO 开始和结束节点只能存在一个
    window.addEventListener('resize', this.resizeFn(this))
    const cellCache = new CellCache();
    await cellCache.init(this.props.system, this.props.fileUrlPrefix);

    const graph = new Graph({
      container: this.container,
      height: getHeight(this.props.gapHeight ?? 0),
      grid: false,
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            const data = node.getData<any>()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
      panning: {
        enabled: true,
        modifiers: 'shift',
      },
      connecting: {
        allowBlank: false,
        highlight: true,
        snap: true,
        allowMulti: false,
        allowLoop: false,
        allowEdge: false,
        router: {
          name: 'er',
        },
        validateConnection: ({ sourceCell, targetCell }) => {
          return this.props.validateConnection ? this.props.validateConnection(sourceCell, targetCell, this.state.graph) : this.validateConnection(sourceCell, targetCell, this.state.graph)
        },

        validateEdge: (args) => {
          return this.props.validateEdge ? this.props.validateEdge(graph, cellCache, args) : this.validateEdge(graph, cellCache, args)
        }
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#D06269',
              stroke: '#D06269',
            },
          },
        },
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
    })
    graph.use(
      new History({
        enabled: true,
      }),
    )
    graph.use(
      new Keyboard({
        enabled: true,
      }),
    )
    graph.use(
      new Clipboard({
        enabled: true,
      }),
    )
    graph.use(
      new Transform({
        resizing: {
          enabled: (arg: Node<Node.Properties>) => {
            //定义部分元素可以调整大小
            return cellCache.isResizing(arg.shape)
          }
        },
      }),
    )
    graph.use(
      new Snapline({
        enabled: true,
      }),
    )
    graph.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
        //解决选中之后导致节点的事件无法响应
        pointerEvents: 'none'
      }),
    )
    graph.use(
      new MiniMap({
        container: this.minimapContainer,
        width: 200,
        height: 150
      }),
    )
    this.props.getData && await this.props.getData(graph, cellCache, collapse)

    graph.scaleContentToFit()
    graph.centerContent()
    graph.on('node:collapse', ({ node }: { node: CollapseGroup }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      collapse(node, collapsed)
    })

    this.initContextMenu(this, graph)

    this.initSelectionEvent(this, graph)

    this.initKeyboard(graph)

    this.setState({ graph: graph, height: getHeight(this.props.gapHeight ?? 0), cellCache: cellCache })
  }

  save(self: DesignerPage) {
    const graph = self.state.graph
    self.props.save && graph && self.props.save(graph, self.state.cellCache)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFn(this))
  }

  //初始化右键菜单
  initContextMenu(self: DesignerPage, graph: Graph) {
    ContextMenuTool.config({
      tagName: 'div',
      isSVGElement: false,
    })

    Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
    Graph.registerNodeTool('contextmenu', ContextMenuTool, true)
    graph.on('cell:contextmenu', ({ cell, e }) => {

      const p = graph.clientToGraph(e.clientX, e.clientY)
      cell.addTools([
        {
          name: 'contextmenu',
          args: {
            menu: self.props.createMenu && self.props.createMenu(graph),
            x: p.x,
            y: p.y,
            onHide() {
              this.cell.removeTools()
            },
          },
        },
      ])
    })
  }

  //自动调整父节点大小
  initNodeChangeEvent(graph: Graph) {
    let ctrlPressed = false
    const embedPadding = 20
    graph.on('node:embedding', ({ e }: { e: any }) => {
      ctrlPressed = e.metaKey || e.ctrlKey
    })

    graph.on('node:embedded', () => {
      ctrlPressed = false
    })
    graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })

    graph.on('node:change:position', ({ node, options }) => {
      if (options.skipParentHandler || ctrlPressed) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(embedPadding)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }

        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            { skipParentHandler: true },
          )
        }
      }
    })
  }

  initSelectionEvent(self: DesignerPage, graph: Graph) {
    graph.on('node:selected', (args: {
      cell: Cell
      node: Node
      options: Model.SetOptions
    }) => {
      if (args.cell.shape == "sub-process") {

      }

      self.setState({ selectCell: args.cell, selectedNode: args.node })
    })

    graph.on('edge:selected', (args: {
      cell: Cell
      edge: Edge
      options: Model.SetOptions
    }) => {
      self.setState({ selectCell: args.cell, selectedEdge: args.edge })
    })

    graph.on('selection:changed', (args: {
      added: Cell[],
      removed: Cell[],
      selected: Cell[],
    }) => {
      graph.getCells().forEach((cell: Cell) => {
        let found = false
        args.selected.forEach((selectedCell: Cell) => {
          if (selectedCell.id == cell.id) {
            found = true
            return
          }
        })
        if (!found) {
          if (cell.isNode()) {
            self.state.cellCache.setUnSelectedColor(cell.shape, cell)
          } else if (cell.isEdge()) {
            self.state.cellCache.setUnSelectedEdgeColor(cell.shape, cell)
          }
        }
      })
      args.selected.forEach((cell: Cell) => {
        if (cell.isNode()) {
          Object.keys(cell.getAttrs()).forEach(key => {
            if (key !== 'text') {
              cell.attr(key + '/fill', globalConfig.selectedFill,)
              cell.attr(key + '/stroke', globalConfig.selectedStroke)
            }
          })
        } else {
          cell.attr('line/stroke', globalConfig.selectedLine)
        }
      })
    })
  }

  private initKeyboard(graph: Graph) {
    const self = this
    // copy cut paste
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        //TODO
        graph.copy(cells)
      }
      return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.getCellsInClipboard()
        const targets = new Map<string, Cell.Properties[]>()
        const sources = new Map<string, Cell.Properties[]>()
        const shapMap = new Map<string, Cell>()
        const newCells: Cell.Properties[] = []
        cells.forEach((cell) => {
          const newCellConf = cell.toJSON()
          newCellConf.markup = cell.markup ? cell.markup : undefined
          newCellConf.attrs = cell.attrs ? { ...cell.attrs } : undefined
          if (newCellConf.source?.cell && newCellConf.source?.cell !== "") {
            let source = sources.get(newCellConf.source?.cell)
            if (!source) source = []
            source.push(newCellConf)
            sources.set(newCellConf.source?.cell, source)
          }
          if (newCellConf.target?.cell && newCellConf.target?.cell !== "") {
            let target = targets.get(newCellConf.target?.cell)
            if (!target) target = []
            target.push(newCellConf)
            targets.set(newCellConf.target?.cell, target)
          }
          shapMap.set(cell.id, cell)
          newCells.push(newCellConf)
        })
        const array: any[] = []
        const edges: Edge[] = []
        newCells.forEach(cell => {
          const oldID = cell.id ?? ""
          const shape = shapMap.get(oldID ?? "")
          cell.id = self.state.cellCache.nextID(shape?.shape ?? "")
          const target = targets.get(oldID)
          target?.forEach(c => {
            if (c["target"] && c["target"].cell) {
              c["target"].cell = cell.id
            }
          })
          const source = sources.get(oldID)
          source?.forEach(c => {
            if (c["source"] && c["source"].cell) {
              c["source"].cell = cell.id
            }
          })
          if (cell.data) {
            cell.data.id = cell.id
            cell.data.workmanshipStepID = cell.id
            if (cell.data.callActiviti) {
              cell.data.callActiviti.workmanshipStepDataID = cell.data.id
              cell.data.callActiviti.id = ""
            }
            if (cell.data.fields) {
              cell.data.fields.forEach((field: any) => {
                field.id = ""
                field.workmanshipStepDataID = cell.data.id
              })
            }
          }
          if (cell["position"]) {
            cell["position"].x += 20
            cell["position"].y += 20
          }
          if (!shape?.isEdge()) {
            const node = new Node(cell)
            graph?.addNode(node)
            array.push(node)
          } else {
            const edge = new Edge(cell)
            edges.push(edge)
          }
        })
        graph.addEdges(edges)
        graph.cleanSelection()
        graph.select(array)
      }
      return false
    })

    //undo redo
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.canUndo()) {
        graph.undo()
      }
      return false
    })
    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (graph.canRedo()) {
        graph.redo()
      }
      return false
    })

    // select all
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
      const nodes = graph.getNodes()
      if (nodes) {
        graph.select(nodes)
      }
    })

    //delete 'backspace', 
    graph.bindKey(['delete'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })

    // zoom
    graph.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = graph.zoom()
      if (zoom < 1.5) {
        graph.zoom(0.1)
      }
    })
    graph.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = graph.zoom()
      if (zoom > 0.5) {
        graph.zoom(-0.1)
      }
    })

    //保存
    window.addEventListener("keydown", function (e) {
      if (e.key == 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        self.save(self)
        e.preventDefault();
      }
    }, false);
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }
  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div style={{ height: this.state?.height ?? 800 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f5f5',
            userSelect: 'none',
          }}
        >
          <SplitBox
            split="vertical"
            minSize={40}
            maxSize={-160}
            defaultSize={230}
            primary="first"
          >
            {this.state?.graph && this.state.cellCache && <StencilPannel addSucess={this.props.addSucess} resizeToFit={true} showPortLabel={true} cellCache={this.state.cellCache} graph={this.state?.graph}></StencilPannel>}
            <SplitBox
              split="vertical"
              minSize={40}
              maxSize={-80}
              defaultSize={400}
              primary="second"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <SplitBox
                  split="horizontal"
                  minSize={40}
                  maxSize={-40}
                  defaultSize={40}
                  primary="first"
                >
                  {this.state?.graph && <ToolBar isBPM={this.props.isBPM} saveFn={() => {
                    this.save(this)
                  }} data={this.props.data} graph={this.state?.graph}></ToolBar>}
                  <div style={{
                    width: '100%',
                    height: '100%',
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                    }} ref={this.refContainer} />
                    <div className="app-minimap" ref={this.refMiniMapContainer} />
                  </div>

                </SplitBox>
              </div>
              {this.state?.graph && <ConfigPannel formID={this.props.graphFormID} cellCache={this.state.cellCache} createSchemaField={this.props.createSchemaField} height={this.state.height} data={this.props.data} id={this.state?.selectCell?.id ?? ''} graph={this.state?.graph}></ConfigPannel>}
            </SplitBox>

          </SplitBox>
        </div>
      </div>
    )
  }
}
