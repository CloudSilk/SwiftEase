import { useEffect, useState } from 'react'
import { CellPropertiesPage } from './CellPropertiesPage'
// @ts-ignore
import './index.less'
import { Graph } from '@antv/x6'
import { GraphPropertiesPage } from './ProcessPropertiesPage'
import { CellCache } from '../../service/service';
import { Form as FormilyForm } from '@formily/core/esm/models';
export enum CONFIG_TYPE {
    GRID,
    NODE,
    EDGE,
}

interface IPropertiesProps {
    id: string,
    graph: Graph,
    data: any
    height: number | string
    cellCache?: CellCache
    createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
    formID: string
    preview?: boolean
    getFormID?: (shape: string) => string
    setFormValues?: (form: FormilyForm<any> | undefined, cellID: string, graph: Graph) => void
    setCellFormValues?: (form: FormilyForm<any> | undefined, cellID: string, graph: Graph) => void
}

interface PropertiesState {
    type: CONFIG_TYPE
    id: string
    shape: string
}

function nodePropertyPage(shape: string, id: string, graph: Graph, data: any, props: IPropertiesProps) {
    let formID = props.getFormID ? props.getFormID(shape) : props.cellCache?.getPropertyFormID(shape)
    if (!formID) return <></>
    return <CellPropertiesPage setFormValues={props.setCellFormValues} preview={props.preview} createSchemaField={props.createSchemaField} formID={formID} id={id} graph={graph} data={data} />
}

export function ConfigPannel(props: IPropertiesProps) {
    const [state, setState] = useState<PropertiesState>({
        type: CONFIG_TYPE.GRID,
        id: '',
        shape: ''
    })

    useEffect(() => {
        const { graph } = props
        graph.on('blank:click', () => {
            setState({
                type: CONFIG_TYPE.GRID,
                id: '',
                shape: ''
            })
        })
        graph.on('cell:click', ({ cell }) => {
            const type = cell.isNode() ? CONFIG_TYPE.NODE : CONFIG_TYPE.EDGE
            setState({
                type: type,
                id: cell.id,
                shape: cell.shape
            })
        })
    }, [])
    return (
        <div style={{ height: props.height, overflowY: 'auto' }} className={'config'}>
            {state.type === CONFIG_TYPE.GRID && (
                <GraphPropertiesPage formID={props.formID} createSchemaField={props.createSchemaField} setFormValues={props.setFormValues} graph={props.graph} data={props.data} />
            )}
            {(state.type === CONFIG_TYPE.NODE || state.type === CONFIG_TYPE.EDGE) && nodePropertyPage(state.shape, state.id, props.graph, props.data, props)}
        </div>
    )
}
