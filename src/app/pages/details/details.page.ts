import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonPopover, NavController } from '@ionic/angular';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { CameraService } from 'src/core/Services/camera/camera.service';
import { DataService } from 'src/core/Services/data-service/data.service';
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { TaskRes } from 'src/core/types/task-res';
import { environment } from 'src/environments/environment';

import * as pdfMake from 'pdfmake/build/pdfmake';      // print or download or open
import * as pdfFonts from 'pdfmake/build/vfs_fonts';   // provide pdfMake with needed Fonts
import htmlToPdfmake from 'html-to-pdfmake';  // convert element.innerHTML  to pdf content
import html2canvas from "html2canvas";        // convert the element.innerHTML  to an image
import html2pdf from 'html2pdf.js';
import { image } from 'html2canvas/dist/types/css/types/image';



@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit, AfterViewInit {

  task: TaskRes;
  qrCodeData: string;
  alternativeImg: string = '../../../assets/imgs/default.png';
  downArrow: string = '../../../assets/imgs/app_icons/Arrow - Down 4.png'
  calenderImg: string = '../../../assets/imgs/app_icons/calendar.png'
  backArrow: string = "../../../assets/imgs/app_icons/Arrow - back.png"

  imagesApi: string = environment.baseUrl + EndPointsEnum.IMAGES



  @ViewChild('editsPopOver') editsPopOver: IonPopover
  @ViewChild('taskDesc') taskDesc: ElementRef
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

  ngAfterViewInit() {
    this.formateTextAreaInputs()
  }


  toggleEdits(event: any) {
    this.editsPopOver.event = event
  }


  formateTextAreaInputs() {
    const desc = this.task.desc.split('\n')
    const descArr = desc.map(c => { return c = c + '<br>' })
    this.taskDesc.nativeElement.innerHTML = descArr.join(' ')
  }


  getQrCodeData() {
    const x = {
      title: this.task.title,
      desc: this.task.desc,
      createdAt: new Date(this.task.createdAt).toString(),
      image: this.task.image != 'path.png' ? this.imagesApi + this.task.image : this.alternativeImg
    };
    return this.qrCodeData = JSON.stringify(x)
  }


  async deleteTask() {
    const agreed = await this.funcService.generalAlert();
    if (!agreed) return;
    this.dataService.deleteData(EndPointsEnum.DELETE, this.task._id).subscribe(async () => {
      await this.dataService.deleteOneStored(this.task._id);
      this.back()
    })
    this.editsPopOver.dismiss()

  }

  async printTask() {

    // load all fonts base64   => re-assign it and use it when generating a new PDF file as it takes some time
    // don't use it before the component as it holds and sometimes prevent loading and initializing the page module
    (pdfMake as any).vfs = pdfFonts.vfs;

    const canvas = await html2canvas(this.content.nativeElement, {
      backgroundColor: 'yellow', // preserve transparent background
      scale: 4,// higher scale for better quality
    });
    const imgData = canvas.toDataURL()
    const docDefinition = {
      pageSize: 'A4',
      content: [
        {
          margin: [150, 0, 0, 0],
          image: imgData,
          width: 210
        }]
    }
    pdfMake.createPdf(docDefinition).open();
    this.editsPopOver.dismiss()
  }


  async shareTask() {
    const uri = (await this.cameraService.getImageUri(this.task)).uri;
    this.funcService.share({ text: 'Share Task ' + this.task.title, uri: uri })
    this.editsPopOver.dismiss()
  }


  toEdits() {
    this.navCtrl.navigateForward('/edit/' + this.task._id)
    this.editsPopOver.dismiss()
  }

  back() {
    this.navCtrl.navigateBack('/tasks')
  }

}
