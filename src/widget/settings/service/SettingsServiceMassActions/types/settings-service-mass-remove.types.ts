export type SettingsServiceMassActionService = {
    id: string;
    title: string;
    parent: SettingsServiceMassActionCategory;
}

export type SettingsServiceMassActionCategory = {
    id: string;
    title: string;
    children: Array<SettingsServiceMassActionService>;
}

export type SettingsServiceMassActionServiceMapper = Record<string, SettingsServiceMassActionService>;
export type SettingsServiceMassActionServiceCategory = Record<string, SettingsServiceMassActionCategory>;