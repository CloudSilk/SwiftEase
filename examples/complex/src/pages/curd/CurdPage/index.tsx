import { useRef } from 'react';
import { ActionType } from '@ant-design/pro-table';
import { useLocation, useModel } from '@umijs/max';

import { TableCurdPage, TreeCurdPage, ListCurdPage, CardCurdPage, ProListCurdPage } from '@swiftease/atali-curd';
import { createSchemaField } from '../../form/field'
import { SplitCurdPage } from '@swiftease/atali-curd';
import queryString from 'query-string';
import { TabManager, TabContext } from '../../../components/TabManager';
import { uuid } from 'uuidv4'
export default () => {
    const location = useLocation()
    const actionRef = useRef<ActionType>()
    const query = queryString.parse(location.search);
    const pageName = query?.pageName ?? '';
    const pageType = Number(query?.type ?? 1);
    const addInDialog = Boolean(query?.addInDialog ?? false);
    const {tabs, searchCaches, setSearchCaches} = useModel('global');
    const setSearchValuesState = (searchValues: any, pageConfig: any) => {
        for(let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            const str = tab.path.split('?')[1];
            const query = queryString.parse(str || '');
            console.log(query);
            const pageName = query?.pageName ?? '';
            if(pageName === pageConfig.name) {
                if(pageName) {
                    searchCaches[pageName as string]=searchValues;
                    setSearchCaches(searchCaches);
                }
                break;
            }
        }
    }
    window["AtaliNoCache"]=true;
    // return (
    //     <>
    //         {pageType === 1 && <TableCurdPage createSchemaField={createSchemaField} pageName={pageName} actionRef={actionRef}></TableCurdPage>}
    //         {pageType === 2 && <TreeCurdPage createSchemaField={createSchemaField} pageName={pageName}></TreeCurdPage>}
    //         {pageType === 3 && <ListCurdPage createSchemaField={createSchemaField} pageName={pageName}></ListCurdPage>}
    //         {pageType === 4 && <CardCurdPage createSchemaField={createSchemaField} pageName={pageName}></CardCurdPage>}
    //         {pageType === 5 && <ProListCurdPage createSchemaField={createSchemaField} pageName={pageName} actionRef={actionRef}></ProListCurdPage>}
    //         {pageType === 6 && <SplitCurdPage createSchemaField={createSchemaField} pageName={pageName} actionRef={actionRef}></SplitCurdPage>}</>
    // );

    return <TabManager key={uuid()}>
            <>
                {pageType === 1 && <TableCurdPage  key={uuid()} createSchemaField={createSchemaField} setSearchValuesState={setSearchValuesState} searchCaches={searchCaches} pageName={pageName} actionRef={actionRef}></TableCurdPage>}
                {pageType === 2 && <TreeCurdPage  key={uuid()} createSchemaField={createSchemaField} pageName={pageName} addInDialog={addInDialog}></TreeCurdPage>}
                {pageType === 3 && <ListCurdPage  key={uuid()} createSchemaField={createSchemaField} pageName={pageName}></ListCurdPage>}
                {pageType === 4 && <CardCurdPage  key={uuid()} createSchemaField={createSchemaField} pageName={pageName}></CardCurdPage>}
                {pageType === 5 && <ProListCurdPage  key={uuid()} createSchemaField={createSchemaField} pageName={pageName} actionRef={actionRef}></ProListCurdPage>}
                {pageType === 6 && <SplitCurdPage  key={uuid()} createSchemaField={createSchemaField} pageName={pageName} actionRef={actionRef}></SplitCurdPage>}
            </>
        </TabManager>

};

