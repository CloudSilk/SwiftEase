import { createSchemaField } from '../../../form/field'
import { FormPreviewPage, newService } from '@swiftease/atali-form';
import { Form as FormData } from "@swiftease/atali-pkg";
import { matchPath, useSearchParams } from '@umijs/max';


export default (props: any) => {
    let [searchParams] = useSearchParams();
    const showButton = searchParams.get('showButton') === 'true';
    const showPageContainer = searchParams.get('showPageContainer') === 'true';
    const title = searchParams.get('pageTitle');
    const match = matchPath(
        { path: "/station/app/view/:formID" },
        location.hash.replace("#",""),
      );
    return (
        <FormPreviewPage formService={newService<FormData>('aiot/station/app')} showPageContainer={showPageContainer} title={title??''} showButton={showButton} createSchemaField={createSchemaField} formID={match?.params?.formID}></FormPreviewPage>
    )
}