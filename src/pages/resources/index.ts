import {
    uploadResourcesWithInstancesRequestAction,
} from '@/action/resources/request-action/uploadResourcesWithInstances/upload-resources-with-instances-request.action.ts';
import {
    ResourcesCompareComponent,
} from '@/widget/resources/ResourcesCompareComponent/ResourcesCompareComponent.ts';


export const isResourcesPage = function (pathname: Array<string>) {
    return pathname[1] === 'resources';
};

export const resourcesPageHandler = async function (pathname: Array<string>) {
    const clientId  = pathname[2];
    const container = document.querySelector(`#page-wrapper > .wrapper-content`);

    console.log('container', container);

    if (container) {
        const data1 = await uploadResourcesWithInstancesRequestAction(clientId);
        const data2 = await uploadResourcesWithInstancesRequestAction(clientId);

        new ResourcesCompareComponent({
            targetData: data1,
            clientData: data2,
            clientId  : clientId,
        })
            .insert(container, 'afterbegin');
    }
};