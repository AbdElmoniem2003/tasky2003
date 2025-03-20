import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { CameraService } from 'src/core/Services/camera/camera.service';
import { DataService } from 'src/core/Services/data-service/data.service';
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { TaskRes } from 'src/core/types/task-res';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit {

  task: TaskRes;
  showEdits: boolean = false;
  alternativeImg: string = '../../../assets/imgs/default.png';

  constructor(
    private dataService: DataService,
    private cameraService: CameraService,
    private funcService: FunctionsService,
    private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    this.task = this.dataService.getTask()
  }


  async deleteTask() {
    const agreed = await this.funcService.generalAlert();
    if (!agreed) return;
    this.dataService.deleteData(EndPointsEnum.DELETE, this.task._id).subscribe(async () => {
      await this.dataService.deleteOneStored(this.task._id);
      this.back()
    })
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
