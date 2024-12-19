import {Observable} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

export const dismissAllModal = (modalService: NgbModal) => {
    return new Observable((observer) => {
        modalService.dismissAll();
        observer.next();
        observer.complete();
    });
}
