import {Picture} from "./picture";
import {Address} from "./address";

export class RealtyObj {
  public roomsAmount: number;
  public floor: number;
  public totalFloors: number;
  public price: number;
  public totalArea: number;
  public livingArea: number;
  public description: string;
  public hasGarage: boolean;
  public hasCellar: boolean;
  public hasLoft: boolean;
  public hasRepairing: boolean;
  public foundationYear: number;
  public otherInfo: string;
  public buildingType: string;
  public targetOperations: string[];
  public confirmed: boolean;
  public realterAware: boolean;
  public dwellingType: string;
  public pictures: Picture[];
  public verificationPicture: Picture;
  public address: Address;
  public realter: string;
  public owner: string;


  constructor() {
    this.targetOperations = [];
    this.pictures = [];
    this.address = new Address();
  }

  public checkIfOperationSupported(operation: string) {
    return this.targetOperations.indexOf(operation) > 0;
  }
}

