import {Injectable} from "@angular/core";
import "rxjs/add/observable/of";

@Injectable()
export class UserService {
  public isAuthenticated: boolean = false;
}
