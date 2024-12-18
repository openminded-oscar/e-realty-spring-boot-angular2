import {Component, Input} from '@angular/core';
import {UserProfile} from '../../../app-models/user';

@Component({
    selector: 'app-user-profile-image',
    templateUrl: './user-profile-image.component.html',
    styleUrl: './user-profile-image.component.scss'
})
export class UserProfileImageComponent {
    private _user: UserProfile;

    @Input()
    public set user(value: UserProfile) {
        this._user = value;
    }
    public get user(): UserProfile {
        return this._user;
    }
}
