
import React from 'react'
import { Graph, Cell, Model, Edge, Node } from '@antv/x6'
import '@antv/x6-react-shape'
import './index.less'
import { ConfigPannel } from '../components'
import { CellCache, CollapseGroup } from '../service/service'
import { globalConfig } from '../utils'
import { Col, Row } from 'antd'
import { Form as FormilyForm } from '@formily/core/esm/models';
import { Selection } from '@antv/x6-plugin-selection'
import { MiniMap } from '@antv/x6-plugin-minimap'
import { Keyboard } from '@antv/x6-plugin-keyboard'

interface GraphPreviewPageProps {
  fileUrlPrefix: string
  system: string
  data: any
  graphFormID: string
  gapHeight?: number
  getData?: (graph: Graph, cellCache: CellCache, collapse: (parent: CollapseGroup, hide: boolean) => void) => Promise<void>
  createSchemaField: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
  getFormID?: (shape: string) => string
  setFormValues?: (form: FormilyForm<any> | undefined, cellID: string, graph: Graph) => void
  setCellFormValues?: (form: FormilyForm<any> | undefined, cellID: string, graph: Graph) => void
  letCol?: number
  rightCol?: number
}

interface GraphPreviewPageState {
  graph?: Graph
  selectCell?: Cell
  selectedNode?: Node
  selectedEdge?: Edge
  height: number | string
  cellCache: CellCache
}

// const magnetAvailabilityHighlighter = {
//   name: 'stroke',
//   args: {
//     padding: 3,
//     attrs: {
//       strokeWidth: 3,
//       stroke: '#52c41a',
//     },
//   },
// }

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

export class GraphPreviewPage extends React.Component<GraphPreviewPageProps, GraphPreviewPageState> {
  private container: HTMLDivElement | undefined
  private minimapContainer: HTMLDivElement | undefined

  constructor(props: any) {
    super(props);
  }

  resizeFn(d: GraphPreviewPage) {
    return () => {
      d.setState({ height: getHeight(d.props.gapHeight ?? 0) })
    }
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
      //禁用移动和连线
      interacting: false,
      panning: {
        enabled: true,
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        minScale: 0.5,
        maxScale: 3,
      },
    })
    graph.use(
      new Selection({
        enabled: true,
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
    graph.use(
      new Keyboard({
        enabled: true,
        global: true,
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

    this.initSelectionEvent(this, graph)

    this.initKeyboard(graph)

    this.setState({ graph: graph, height: getHeight(this.props.gapHeight ?? 0), cellCache: cellCache })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFn(this))
  }


  initSelectionEvent(self: GraphPreviewPage, graph: Graph) {
    graph.on('node:selected', (args: {
      cell: Cell
      node: Node
      options: Model.SetOptions
    }) => {
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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }
  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <Row>
        <Col span={this.props.letCol ?? 18}>
          <div style={{
            width: '100%',
            height: '100%',
          }}>
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
                <div style={{
                  width: '100%',
                  height: '100%',
                }} ref={this.refContainer} />
                <div className="app-minimap" ref={this.refMiniMapContainer} />
              </div>
            </div>
          </div>
        </Col>
        <Col span={this.props.rightCol ?? 6}>
          {this.state?.graph && <ConfigPannel formID={this.props.graphFormID}
            cellCache={this.state.cellCache}
            createSchemaField={this.props.createSchemaField}
            height={this.state.height} data={this.props.data}
            getFormID={this.props.getFormID}
            setFormValues={this.props.setFormValues}
            setCellFormValues={this.props.setCellFormValues}
            id={this.state?.selectCell?.id ?? ''} graph={this.state?.graph}></ConfigPannel>}
        </Col>
      </Row>
    )
  }
}
