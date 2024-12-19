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
    public resetPasswordForm: FormGroup;

    public emailSubmitted = false;


    constructor(public modal: NgbActiveModal,
                public forgotPasswordService: ForgotPasswordService,
                public fb: FormBuilder) {

    }

    ngOnInit(): void {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });

        this.resetPasswordForm = this.fb.group({
            confirmationCode: ['', [Validators.required]],
            newPassword: [{value: '', disabled: true}, [Validators.required]],
        });

        this.resetPasswordForm.get('confirmationCode')!.valueChanges.subscribe(value => {
            const newPasswordControl = this.resetPasswordForm.get('newPassword');
            if (value) {
                newPasswordControl!.enable();
            } else {
                newPasswordControl!.disable();
            }
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
        const {newPassword, confirmationCode} = this.resetPasswordForm.value;
        this.forgotPasswordService.resetPasswordRequest(newPassword, confirmationCode)
            .pipe(take(1))
            .subscribe({
                next: r => {
                    this.modal.close();
                }
            });
    }
}
