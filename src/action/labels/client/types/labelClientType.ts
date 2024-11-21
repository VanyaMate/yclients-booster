export type LabelClientType = {
    id: string;
    entity: string;
    title: string;
    color: string;
    icon: string;
}

export type ChangeLabelClientType = {
    entity: string;
    title: string;
    color: string; // hex
    icon: string;
}