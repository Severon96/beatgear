export type HardwareStatus = "succeeded" | "loading" | "failed";

export enum HardwareCategory {
    CONTROLLER = 'controller',
    LIGHT = 'light',
    CABLE_XLR = 'cable_xlr',
    PLUG_COLD_APPLIANCE = 'plug_cold_appliance',
    LAPTOP_STAND = 'laptop_stand',
    OTHER = 'other'
}

export type Hardware = {
    id: string;
    name: string;
    serial: string;
    image?: Uint8Array;
    category: HardwareCategory;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    price_per_hour: number;
};
