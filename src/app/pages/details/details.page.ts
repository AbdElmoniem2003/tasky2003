import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { CameraService } from 'src/core/Services/camera/camera.service';
import { DataService } from 'src/core/Services/data-service/data.service';
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { TaskRes } from 'src/core/types/task-res';

import * as pdfMake from 'pdfmake/build/pdfmake';      // print or download or open
import * as pdfFonts from 'pdfmake/build/vfs_fonts';   // provide pdfMake with needed Fonts
import htmlToPdfmake from 'html-to-pdfmake';  // convert element.innerHTML  to pdf content
import html2canvas from "html2canvas";        // convert the element.innerHTML  to an image
import html2pdf from 'html2pdf.js';



@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit {

  task: TaskRes;
  qrCodeData: string;
  showEdits: boolean = false;
  alternativeImg: string = '../../../assets/imgs/default.png';
  downArrow: string = '../../../assets/imgs/app_icons/Arrow - Down 4.png'
  calenderImg: string = '../../../assets/imgs/app_icons/calendar.png'
  backArrow: string = "../../../assets/imgs/app_icons/Arrow - back.png"

  @ViewChild('content') content: ElementRef

  constructor(
    private dataService: DataService,
    private cameraService: CameraService,
    private funcService: FunctionsService,
    private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    this.task = this.dataService.getTask();
  }

  ionViewWillEnter() { this.showEdits = false }

  getQrCodeData() {
    const x = { title: this.task.title, desc: this.task.desc, createdAt: new Date(this.task.createdAt).toString() };
    return this.qrCodeData = JSON.stringify(x)
  }


  async deleteTask() {
    const agreed = await this.funcService.generalAlert();
    if (!agreed) return;
    this.dataService.deleteData(EndPointsEnum.DELETE, this.task._id).subscribe(async () => {
      await this.dataService.deleteOneStored(this.task._id);
      this.back()
    })
  }

  hideEdits() {
    const editListEle = document.querySelector('.edits.active')
    if (editListEle) this.showEdits = false
  }


  async printTask() {
    this.showEdits = false;

    // load all fonts base64   => re-assign it and use it when generating a new PDF file as it takes some time
    // don't use it before the component as it holds and sometimes prevent loading and initializing the page module
    (pdfMake as any).vfs = pdfFonts.vfs;

    window.print()
  }






  async shareTask() {
    const uri = (await this.cameraService.getImageUri(this.task)).uri;
    this.funcService.share({ text: 'Share Task ' + this.task.title, uri: uri })
  }


  toEdits() {
    this.navCtrl.navigateForward('/edit/' + this.task._id)
  }

  back() {
    this.navCtrl.navigateBack('/tasks')
  }

}
