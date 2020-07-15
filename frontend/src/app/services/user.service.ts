import {Injectable} from "@angular/core";
import "rxjs/add/observable/of";
import {User} from "../domain/user";

@Injectable()
export class UserService {
  public isAuthenticated: boolean = false;
  public user: User = null;
}
