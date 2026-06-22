import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, of, timer} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import {UserService} from '../app-services/user.service';
import {SampleSocketService} from '../app-services/socket/sample-socket.service';
import {GlobalNotificationService} from '../app-services/global-notification.service';
import {User} from '../app-models/user';
import {RealtyObj} from '../app-models/realty-obj';
import {SignInSignOutService} from '../app-services/auth/sign-in-sign-out.service';
import {LoaderService} from '../app-services/loader.service';
import {MIN_LOADER_SHOW_TIME} from './data-loader/data-loader.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    public isLoading$ = new BehaviorSubject<boolean>(false);

    constructor(public http: HttpClient,
                public signinSignoutService: SignInSignOutService,
                public router: Router,
                public socketService: SampleSocketService,
                public socialAuthService: SocialAuthService,
                public notificationService: GlobalNotificationService,
                public loaderService: LoaderService,
                public cdr: ChangeDetectorRef,
                public userService: UserService) {
    }

    public ngOnInit(): void {
        this.loaderService.isLoading$.pipe(
            switchMap(isLoading => {
                if (isLoading) {
                    return of(isLoading);
                } else {
                    return timer(MIN_LOADER_SHOW_TIME).pipe(map(() => isLoading));
                }
            })
        ).subscribe(isLoading => {
            this.isLoading$.next(isLoading);
            this.cdr.detectChanges();
        });

        if (localStorage.getItem('token')) {
            this.userService.fetchUserStatus();
        } else {
            this.userService.clearUserInState();
        }
        this.socialAuthService.authState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((googleUser: SocialUser) => {
            const {email, idToken, authToken, authorizationCode} = googleUser;
            this.signinSignoutService.signInWithGoogleData({
                email,
                idToken,
                authToken,
                authorizationCode,
                type: 'google'
            });
        });
        this.userService.user$
            .pipe(
                switchMap(user =>
                    this.socketService.currentDocument.pipe(
                        map(object => ({object, user})),
                        takeUntilDestroyed(this.destroyRef)
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: ({object, user}) => this.handleAddToFavoritesSocketUpdate(object, user),
                error: err => console.error('Error in socket subscription:', err)
            });
    }

    public handleAddToFavoritesSocketUpdate(interest: any, user: User) {
        if (interest.realtyObjId && user && user.realtorDetails) {
            const realtor = user.realtorDetails;
            const suitableObjects = realtor.realtyObjects.filter((realtyObject: RealtyObj) => {
                return realtyObject.id === interest.realtyObjId;
            });
            if (suitableObjects.length) {
                this.notificationService.showNotification('Success! Somebody interested with your object!' + interest.realtyObjId);
            }
        }
    }
}
