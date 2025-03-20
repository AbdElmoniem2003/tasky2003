import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { EMPTY, from, Observable, ObservableInput, switchMap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../Services/auth-service/auth.service";
import { DataService } from "../Services/data-service/data.service";
import { Capacitor } from "@capacitor/core";
import { NavController } from "@ionic/angular";
import { Injectable } from "@angular/core";


@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private dataService: DataService,
    private navCtrl: NavController
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.addToken(req, next).pipe(
      catchError((err): Observable<HttpEvent<any> | any> => {

        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401:             // Unauthorized
              return this.handleError401(req, next);
            case 403:             // refresh_token Expired
              return this.logOutUser();
            default:
              return throwError(err)
          }
        } else {
          return throwError(() => err);
        }
      }))

  }

  handleError401(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshToken()
      .pipe(switchMap((res) => { return this.addToken(req, next) }))
  }

  addToken(req: HttpRequest<any>, next: HttpHandler) {
    let clonnedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authService.getAccessToken(),
      },
    })

    return next.handle(clonnedReq)
  }

  logOutUser() {
    this.authService.logOut().then(() => {
      const isWeb = Capacitor.getPlatform() == 'web'
      this.navCtrl.navigateBack(isWeb ? '/start' : "/login")
    })
    return EMPTY
  }

}
