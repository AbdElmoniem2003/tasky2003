import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { IonPopover, NavController } from '@ionic/angular';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { CameraService } from 'src/core/Services/camera/camera.service';
import { DataService } from 'src/core/Services/data-service/data.service';
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { NewTask } from 'src/core/types/task';
import { TaskRes } from 'src/core/types/task-res';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: false
})
export class AddPage implements OnInit {


  @ViewChild('dueDatePicker') dueDatePicker: IonPopover;

  statuses: string[] = ['waiting', 'inprogress', 'finished']
  priorities: string[] = ['low', 'medium', 'high']
  addForm: FormGroup
  task: NewTask = null
  taskDueDate: Date = null
  image: string | ArrayBuffer;
  imgBlob: Blob;


  constructor(
    private dataService: DataService,
    private cameraService: CameraService,
    private funcService: FunctionsService,
    private builder: FormBuilder,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.addForm = this.builder.group({
      "title": ['', [Validators.required]],
      "desc": ['', [Validators.required]],
      "priority": [this.priorities[1], [Validators.required]],
      "dueDate": [this.taskDueDate, [Validators.required]]
    })
  }


  async addImage() {
    const photo: Photo = await this.cameraService.getImage(this.image as string);
    if (photo) {
      const blob = await this.cameraService.getImageBlob(photo);
      this.imgBlob = await this.cameraService.resizeImage(blob);
      this.image = await this.cameraService.readImageBase64(this.imgBlob) as string;
    } else {
      this.image = null
      this.imgBlob = null
    }
  }


  addTask() {
    this.task = this.addForm.value
    this.task.dueDate = new Date(this.taskDueDate).toDateString();
    this.funcService.showLoading()
    const formData = new FormData();
    formData.append('image', this.imgBlob)
    //upload image
    if (this.imgBlob) {
      this.dataService.postData(EndPointsEnum.UPLOAD, formData).subscribe((res) => {
        this.task.image = res.image;
        this.uploadTask()
      }, (err) => {
        this.funcService.dismissLoading()
        this.funcService.generalAlert({ message: 'Image Size Too Large " over 1Mb "' })
      })
    } else {
      this.task.image = "path.png"
      this.uploadTask()
    }
  }

  uploadTask() {
    // add new Task
    this.dataService.postData(EndPointsEnum.TODOS, this.task)
      .subscribe(async (res: TaskRes) => {
        this.funcService.dismissLoading()
        this.funcService.generalToast({ message: 'Task Added Successfully', color: 'success' })
        this.back()
      })
  }


  pickDate(ev: any) {
    this.dueDatePicker.event = ev;
  }

  back() {
    this.navCtrl.navigateBack('/tasks')
  }

}
