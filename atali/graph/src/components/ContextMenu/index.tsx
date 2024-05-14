import ReactDom from 'react-dom'
import { Menu,Dropdown } from 'antd'
import { ToolsView, EdgeView } from '@antv/x6'

export class ContextMenuTool extends ToolsView.ToolItem<EdgeView, ContextMenuToolOptions> {
    // @ts-ignore
    private knob: HTMLDivElement

    render() {
        super.render()
        this.knob = ToolsView.createElement('div', false) as HTMLDivElement
        this.knob.style.position = 'absolute'
        this.container.appendChild(this.knob)
        this.updatePosition(this.options)
        setTimeout(() => {
            this.toggleTooltip(true)
        })
        return this
    }

    private toggleTooltip(visible: boolean) {
        ReactDom.unmountComponentAtNode(this.knob)
        document.removeEventListener('mousedown', this.onMouseDown)
        if (visible) {
            ReactDom.render(
                <Dropdown
                    open={true}
                    trigger={['contextMenu']}
                    // @ts-ignore
                    menu={this.options.menu}
                    
                >
                    <a />
                </Dropdown>,
                this.knob,
            )
            document.addEventListener('mousedown', this.onMouseDown)
        }
    }

    private updatePosition(pos?: { x: number; y: number }) {
        const style = this.knob.style
        if (pos) {
            style.left = `${pos.x}px`
            style.top = `${pos.y}px`
        } else {
            style.left = '-1000px'
            style.top = '-1000px'
        }
    }

    private onMouseDown = (e: MouseEvent) => {
        this.updatePosition()
        this.toggleTooltip(false)
        if (this.options.onHide) {
            this.options.onHide.call(this)
        }
    }
}

export interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
    x: number
    y: number
    menu?: typeof Menu | (() => typeof Menu)
    onHide?: (this: ContextMenuTool) => void,
}