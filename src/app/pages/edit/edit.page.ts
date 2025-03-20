import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { CameraService } from 'src/core/Services/camera/camera.service';
import { DataService } from 'src/core/Services/data-service/data.service';
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { NewTask } from 'src/core/types/task';
import { TaskRes } from 'src/core/types/task-res';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'], standalone: false

})
export class EditPage implements OnInit {

  statuses: string[] = ['waiting', 'inprogress', 'finished']
  priorities: string[] = ['low', 'medium', 'high']
  editForm: FormGroup;
  taskToEdit: TaskRes;
  newTask: NewTask;
  image: string = null;
  imgBlob: Blob;
  alternativeImg: string = '../../../assets/imgs/default.png';

  constructor(
    private dataService: DataService,
    private cameraService: CameraService,
    private funcService: FunctionsService,
    private builder: FormBuilder,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.taskToEdit = this.dataService.getTask();
    console.log(this.taskToEdit.image.length)
    this.image = this.taskToEdit.image
    this.initForm()
  }

  initForm() {
    this.editForm = this.builder.group({
      "title": [this.taskToEdit.title, Validators.required],
      "desc": [this.taskToEdit.desc, Validators.required],
      "status": [this.taskToEdit.status, Validators.required],
      "priority": [this.taskToEdit.priority, Validators.required],
      "dueDate": [this.taskToEdit.createdAt, Validators.required]
    })
  }


  async updateImg() {
    const photo: Photo = await this.cameraService.getImage(this.image as string);
    if (photo) {
      const blob = await this.cameraService.getImageBlob(photo);
      this.imgBlob = await this.cameraService.resizeImage(blob);
      this.image = await this.cameraService.readImageBase64(this.imgBlob) as string;
    } else {
      this.image = 'path.png'
      this.imgBlob = null
    }
  }



  updateTask() {
    this.funcService.showLoading()
    const formData = new FormData();

    formData.append('image', this.imgBlob)
    //upload image
    this.imgBlob ? this.dataService.postData(EndPointsEnum.UPLOAD, formData) : null;

    // update Task
    this.newTask = this.editForm.value
    this.newTask.image = this.image
    this.dataService.putData(EndPointsEnum.EDIT + this.taskToEdit._id, this.newTask)
      .subscribe(async (res: TaskRes) => {
        // await just to update the current task data before returning to tasks page
        await this.saveOrRenameOrDelete(this.taskToEdit, this.newTask)
        await this.dataService.updateStoredOne(res, this.taskToEdit._id);
        this.funcService.dismissLoading()
        this.funcService.generalToast({ message: 'Task Updated Successfully', color: 'success' })
        this.navCtrl.navigateForward('/tasks')
      })
  }


  async saveOrRenameOrDelete(oldTask: TaskRes, newTask: NewTask) {
    if (oldTask.image) {
      if (newTask.image) {
        if (newTask.image == 'path.png') {
          console.log('Old Deleted Only')
          this.cameraService.deleteImage(oldTask)
        }
        else if (newTask.image !== oldTask.image) {
          console.log('Old Deleted   &&   New Saved');
          this.cameraService.saveImage(newTask);
          this.cameraService.deleteImage(oldTask);
        }
        else if (oldTask.title !== newTask.title || oldTask.desc !== newTask.desc) {
          console.log('Old Renamed Only');
          await this.cameraService.renameImage(oldTask, newTask)
        }
      }
    }
    else {
      if (newTask.image !== 'path.png' && newTask.image) {
        console.log('No Old But New');
        this.cameraService.saveImage(newTask);
      }
    }
  }











  pickDate() {
    const dateInputEle: HTMLInputElement = document.querySelector('.pick-date');
    dateInputEle.showPicker()
  }

  back() {
    this.navCtrl.navigateBack('/details/' + this.taskToEdit._id)
  }

}
