// https://yclients.com/resource_instances/save/101669/0 POST
// payload FormData -> { title: Педикюрное кресло 4 }

// https://yclients.com/resources/save/1092329/0 POST
// payload FormData -> { title: TestResource; description: Desciprtion }

export type Resource = {
    id: string;
    title: string;
    description: string;
    instances: Array<ResourceInstance>;
}

export type ResourceInstance = {
    id: string;
    title: string;
};

export type ResourceInstanceCreateData = {
    title: string;
}

export type ResourceInstanceUpdateData = {
    title: string;
}

export type ResourceCreateData = {
    title: string;
    description: string;
}