import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import "rxjs/add/observable/of";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  public isAuthenticated(): boolean {
    return true;
  }
}
