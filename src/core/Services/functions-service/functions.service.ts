import { Injectable } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController
} from "@ionic/angular";

interface generalOptions { message?: string, classes?: string, btns?: { ok: string, no: string, other: string } }


@Injectable({ providedIn: 'root' })

export class FunctionsService {


  constructor(
    // private storage: Storage
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) { }


  async generalToast(opts: generalOptions) {
    const toast = await this.toastCtrl.create({
      message: opts.message || 'Are You Sure',
      cssClass: opts.classes,
      buttons: [{
        text: opts.btns?.ok || 'Confirm'
      }]
    })
    await toast.present()
  }

  async generalAlert(opts: generalOptions) {
    const toast = await this.toastCtrl.create({
      message: opts.message || 'Are You Sure',
      cssClass: opts.classes,
      buttons: [{
        text: opts.btns?.ok || 'Confirm'
      }]
    })
    await toast.present()
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
}
