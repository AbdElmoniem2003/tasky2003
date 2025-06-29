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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'], standalone: false

})
export class EditPage implements OnInit {

  @ViewChild('dueDatePicker') dueDatePicker: IonPopover;

  statuses: string[] = ['waiting', 'inprogress', 'finished']
  priorities: string[] = ['low', 'medium', 'high']
  editForm: FormGroup;
  taskToEdit: TaskRes;
  newTask: NewTask = {
    image: '',
    title: '',
    desc: '',
    priority: '',
    dueDate: ''
  }
  image: string = null;
  imgBlob: Blob;
  alternativeImg: string = '../../../assets/imgs/default.png';

  imagesApi: string = environment.baseUrl + EndPointsEnum.IMAGES
  taskDueDate: Date = null;


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
    this.taskToEdit = this.dataService.getTask();
    this.taskDueDate = new Date(this.taskToEdit.createdAt);

    this.editForm = this.builder.group({
      "title": [this.taskToEdit.title, Validators.required],
      "desc": [this.taskToEdit.desc, Validators.required],
      "status": [this.taskToEdit.status, Validators.required],
      "priority": [this.taskToEdit.priority, Validators.required],
      "dueDate": [this.taskDueDate, Validators.required]
    })
    this.image = this.imagesApi + this.taskToEdit.image
  }


  async updateImg() {
    const photo: Photo = await this.cameraService.getImage(this.image as string);
    if (photo) {
      const blob = await this.cameraService.getImageBlob(photo);
      this.imgBlob = await this.cameraService.resizeImage(blob);
    } else {
      this.image = null
      this.imgBlob = null
    }
  }

  updateTask() {
    // update Task
    this.newTask = this.editForm.value
    this.funcService.showLoading()

    //upload image  => if there is a new one
    if (this.imgBlob) {
      const formData = new FormData();
      formData.append('image', this.imgBlob)
      this.dataService.postData(EndPointsEnum.UPLOAD, formData).subscribe((res) => {
        this.newTask.image = res.image;
        this.updateTaskData()
      }, (error) => {
        this.funcService.dismissLoading();
        this.funcService.generalToast({ message: 'Image Size Is Too Large' })
      })
    } else {
      // image is the same if it's not reset
      this.newTask.image = (this.image) ? this.taskToEdit.image : 'path.png'
      this.updateTaskData()
    }
  }

  updateTaskData() {
    this.dataService.putData(EndPointsEnum.EDIT + this.taskToEdit._id, this.newTask)
      .subscribe((res: TaskRes) => {
        this.funcService.dismissLoading()
        this.funcService.generalToast({ message: 'Task Updated Successfully', color: 'success' })
        this.navCtrl.navigateForward('/tasks')
      })
  }

  pickDate(ev: any) {
    this.dueDatePicker.event = ev
  }

  back() {
    this.navCtrl.navigateBack('/details/' + this.taskToEdit._id)
  }

}
