import { Injectable } from "@angular/core";
import { Share } from "@capacitor/share";

import {
  ActionSheetController,
  AlertController,
  ModalController,
  NavController,
  ToastController, AlertOptions
} from "@ionic/angular";

interface generalOptions {
  message?: string,
  classes?: string,
  color?: string,
  btns?: { ok?: string, no?: string, other?: string }
}


@Injectable({ providedIn: 'root' })

export class FunctionsService {


  constructor(
    // private storage: Storage
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }


  async generalToast(opts: generalOptions) {
    const toast = await this.toastCtrl.create({
      message: opts.message,
      duration: 2000,
      position: 'top',
      color: opts.color || 'success',
      buttons: [{
        text: opts.btns?.ok || 'Confirm'
      }]
    })
    await toast.present()
  }

  async generalAlert(opts?: generalOptions) {
    return new Promise<Boolean>(async (resolve, reject) => {
      const toast = await this.alertCtrl.create({
        message: opts?.message || 'Are You Sure',
        cssClass: opts?.classes || 'danger',
        mode: 'ios',
        buttons: [{
          text: opts?.btns.ok || 'Confirm',
          handler: () => resolve(true)
        }, {
          text: opts?.btns.no || 'Cancel', role: 'cancel'
        }],
      })
      await toast.present()
    })
  }

  async generalActionSheet(opts: { message?: string, classes?: string, btns?: { ok: string } }) {
    const toast = await this.toastCtrl.create({
      message: opts.message || 'Are You Sure',
      cssClass: opts.classes,
      buttons: [{
        text: opts.btns?.ok || 'Confirm'
      }]
    })
    await toast.present()
  }


  share(obj: object | any) {
    Share.share({
      url: obj.url,
      text: obj.text,
    })
  }

  showLoading() {
    const imgEle = document.createElement('img');
    imgEle.src = '../../../assets/imgs/transparent_loading.gif';
    imgEle.classList.add('show-loading')
    document.body.appendChild(imgEle);
  }

  dismissLoading() {
    const loadingEle = document.querySelector('.show-loading');
    document.body.removeChild(loadingEle)
  }


  async checkDarkThemes() {
    const checkDarkOrLight = window.matchMedia('(prefers-color-scheme: dark)');
    // activate dark if dark is the default
    this.activateDarkThemes(checkDarkOrLight.matches)
    // change themes by changing system themes
    checkDarkOrLight.addEventListener(('change'), (media) => {
      this.activateDarkThemes(media.matches)
    })
  }
  activateDarkThemes(themeCase: boolean) {
    document.body.classList.toggle('dark', themeCase)
  }


}
