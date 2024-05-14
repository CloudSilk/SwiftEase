import { TableCurdPage } from "../../TableCurdPage";
import { TreeCurdPage } from "../../TreeCurdPage";
import { ListCurdPage } from "../../ListCurdPage";
import { CardCurdPage } from "../../CardCurdPage";
import { ProListCurdPage } from "../../ProListCurdPage";

export default (props: {
    pageName?: string,
    createSchemaField?: any,
    type?: number,
    actionRef?: any,
    rowClick?: (data: any) => void,
    fromParentData?: any
}) => {
    console.log('ppprops: ', props);
    const pageType = Number(props.type ?? 1);
    return (
        <>
            {pageType === 1 && <TableCurdPage createSchemaField={props.createSchemaField} pageName={props.pageName} 
                    actionRef={props.actionRef} rowClick={props.rowClick} fromParentData={props.fromParentData}></TableCurdPage>}
            {pageType === 2 && <TreeCurdPage createSchemaField={props.createSchemaField} pageName={props.pageName} rowClick={props.rowClick} fromParentData={props.fromParentData}></TreeCurdPage>}
            {pageType === 3 && <ListCurdPage createSchemaField={props.createSchemaField} pageName={props.pageName} fromParentData={props.fromParentData}></ListCurdPage>}
            {pageType === 4 && <CardCurdPage createSchemaField={props.createSchemaField} pageName={props.pageName} fromParentData={props.fromParentData}></CardCurdPage>}
            {pageType === 5 && <ProListCurdPage createSchemaField={props.createSchemaField} pageName={props.pageName} actionRef={props.actionRef}  rowClick={props.rowClick} fromParentData={props.fromParentData}></ProListCurdPage>}
            </>
    );
}