export type HardwareStatus = "succeeded" | "loading" | "failed";

export enum HardwareCategory {
    CONTROLLER = 'CONTROLLER',
    LIGHT = 'LIGHT',
    CABLE_XLR = 'CABLE_XLR',
    PLUG_COLD_APPLIANCE = 'PLUG_COLD_APPLIANCE',
    LAPTOP_STAND = 'LAPTOP_STAND',
    OTHER = 'OTHER'
}

export const hardwareCategoryLabels = new Map<HardwareCategory, string>([
    [HardwareCategory.CONTROLLER, "Controller"],
    [HardwareCategory.LIGHT, "Licht"],
    [HardwareCategory.CABLE_XLR, "XLR-Kabel"],
    [HardwareCategory.PLUG_COLD_APPLIANCE, "Kaltgerätestecker"],
    [HardwareCategory.LAPTOP_STAND, "Laptop-Ständer"],
    [HardwareCategory.OTHER, "Anderes"],
]);


export type Hardware = {
    id: string;
    name: string;
    serial: string;
    image?: Uint8Array;
    category: HardwareCategory;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    price_per_day: number;
};

export function getReadableCategory(hardwareCategory: HardwareCategory): string {
    return hardwareCategoryLabels.get(hardwareCategory) ?? "";
}
