import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserProfile} from '../../app-models/user';

@Component({
    selector: 'app-realtor-contact',
    templateUrl: './user-contact-modal.component.html',
    styleUrls: ['./user-contact-modal.component.scss']
})
export class UserContactModalComponent {
    public user: UserProfile;
    public userTitle: string;
    public message: string;

    constructor(public activeModal: NgbActiveModal) {
    }
}
