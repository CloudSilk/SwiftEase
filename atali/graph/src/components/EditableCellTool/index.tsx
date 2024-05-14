import { Graph, ToolsView, EdgeView, Point } from '@antv/x6'

export class EditableCellTool extends ToolsView.ToolItem<
  EdgeView,
  EditableCellToolOptions
> {
  // @ts-ignore
  private editorContent: HTMLDivElement 

  render() {
    super.render()
    const cell = this.cell
    let x = 0
    let y = 0
    let width = 0
    let height = 0

    if (cell.isNode()) {
      const position = cell.position()
      const size = cell.size()
      const pos = this.graph.localToGraph(position)
      const zoom = this.graph.zoom()
      x = pos.x
      y = pos.y
      width = size.width * zoom
      height = size.height * zoom
    } else {
      x = this.options.x - 40
      y = this.options.y - 20
      width = 80
      height = 40
    }

    const editorParent = ToolsView.createElement('div', false) as HTMLDivElement
    editorParent.style.position = 'absolute'
    editorParent.style.left = `${x}px`
    editorParent.style.top = `${y}px`
    editorParent.style.width = `${width}px`
    editorParent.style.height = `${height}px`
    editorParent.style.display = 'flex'
    editorParent.style.alignItems = 'center'
    editorParent.style.textAlign = 'center'

    this.editorContent = ToolsView.createElement('div', false) as HTMLDivElement
    this.editorContent.contentEditable = 'true'
    this.editorContent.style.width = '100%'
    this.editorContent.style.outline = 'none'
    this.editorContent.style.backgroundColor = cell.isEdge() ? '#fff' : ''
    this.editorContent.style.border = cell.isEdge() ? '1px solid #ccc' : 'none'
    editorParent.appendChild(this.editorContent)
    this.container.appendChild(editorParent)

    this.init()
  
    return this
  }

  init = () => {
    const cell = this.cell
    if (cell.isNode()) {
      const value = cell.attr('text/textWrap/text') as string
      if (value) {
        this.editorContent.innerText = value
        cell.attr('text/style/display', 'none')
      }
    }
    setTimeout(() => {
      this.editorContent.focus()
    })
    document.addEventListener('mousedown', this.onMouseDown)
  }

  onMouseDown = (e: MouseEvent) => {
    if (e.target !== this.editorContent) {
      const cell = this.cell
      const value = this.editorContent.innerText
      cell.removeTools()
      if (cell.isNode()) {
        cell.attr('text/textWrap/text', value)
        cell.attr('text/style/display', '')
      } else if (cell.isEdge()) {
        cell.appendLabel({
          attrs: {
            text: {
              text: value,
            }
          },
          position: {
            distance: this.getDistance(),
          }
        })
      }
      document.removeEventListener('mousedown', this.onMouseDown)
    }
  }

  getDistance() {
    const cell = this.cell
    if (cell.isEdge()) {
      const targetPoint = cell.getTargetPoint()
      const cross = cell.getSourceNode()!.getBBox().intersectsWithLineFromCenterToPoint(targetPoint)!
      const p = new Point(this.options.x, this.options.y)
      return p.distance(cross)
    }
    return 0
  }
}

EditableCellTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface EditableCellToolOptions extends ToolsView.ToolItem.Options {
  x: number
  y: number
}

Graph.registerEdgeTool('editableCell', EditableCellTool, true)
Graph.registerNodeTool('editableCell', EditableCellTool, true)