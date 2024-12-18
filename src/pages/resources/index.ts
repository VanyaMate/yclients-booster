import {
    ResourceCopyFormComponent,
} from '@/widget/resources/ResourceCopyFormComponent/ResourceCopyFormComponent.ts';


export const isResourcesPage = function (pathname: Array<string>) {
    return pathname[1] === 'resources';
};

export const resourcesPageHandler = async function (pathname: Array<string>) {
    const clientId  = pathname[2];
    const container = document.querySelector(`#page-wrapper > .wrapper-content`);

    console.log('container', container);

    if (container) {
        new ResourceCopyFormComponent({
            clientId: clientId,
        })
            .insert(container, 'afterbegin');
    }
};