import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {take} from 'rxjs';
import {ForgotPasswordService} from '../../app-services/auth/forgot-password.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password-modal.component.html',
    styleUrl: './forgot-password-modal.component.scss'
})
export class ForgotPasswordModalComponent implements OnInit {
    public forgotPasswordForm: FormGroup;

    public emailSubmitted = false;

    constructor(public modal: NgbActiveModal,
                public forgotPasswordService: ForgotPasswordService,
                public fb: FormBuilder) {

    }

    ngOnInit(): void {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    public submitEmail() {
        const email = this.forgotPasswordForm.value;
        this.forgotPasswordService.forgotPasswordRequest(email)
            .pipe(take(1))
            .subscribe({
                next: r => {
                    this.emailSubmitted = true;
                }, error: err => {
                    this.modal.dismiss('Error on Email submit for Forgot Password');
                }
            });
    }

    public submitConfirmationCode() {
        const code = 'code'; // TODO grab confirmation code
        const newPassword = 'newPassword'; // TODO grab confirmation code
        this.forgotPasswordService.resetPasswordRequest(newPassword, code)
            .pipe(take(1))
            .subscribe({
                next: r => {
                    this.emailSubmitted = true;
                }
            });
    }
}
