import {Injectable} from '@angular/core';

export enum OPERATION_TYPES {
    SELLING = 'SELLING',
    RENT = 'RENT',
}

export enum DWELLING_TYPES {
    APARTMENT = 'APARTMENT',
    HOUSE = 'HOUSE'
}

export enum BUILDING_TYPES {
    BRICK = 'BRICK',
    BLOCK = 'BLOCK',
    WOODEN = 'WOODEN'
}

@Injectable({providedIn: 'root'})
export class ConfigService {
    constructor() {
    }

    private _supportedOperations: string[] = Object.values(OPERATION_TYPES);

    get supportedOperations(): string[] {
        return this._supportedOperations;
    }

    private _supportedDwellingTypes: string[] = Object.values(DWELLING_TYPES);

    get supportedDwellingTypes(): string[] {
        return this._supportedDwellingTypes;
    }

    set supportedDwellingTypes(value: string[]) {
        this._supportedDwellingTypes = value;
    }

    private _supportedBuildingTypes: string[] = Object.values(BUILDING_TYPES);

    get supportedBuildingTypes(): string[] {
        return this._supportedBuildingTypes;
    }

    set supportedBuildingTypes(value: string[]) {
        this._supportedBuildingTypes = value;
    }
}
