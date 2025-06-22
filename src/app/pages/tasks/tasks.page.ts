import { Component, OnInit } from '@angular/core';
import { NavController, RefresherCustomEvent } from '@ionic/angular';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { AuthService } from 'src/core/Services/auth-service/auth.service';
import { CameraService } from 'src/core/Services/camera/camera.service';
import { DataService } from 'src/core/Services/data-service/data.service';
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { TaskRes } from 'src/core/types/task-res';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false
})
export class TasksPage implements OnInit {

  tasks: TaskRes[];
  statuses: string[] = ['all', 'inprogress', 'waiting', 'finished'];
  filterStatus: string = 'all';
  alternateImg: string = '../../../assets/imgs/default.png'
  skip: number = 1
  isLoading: boolean = false;
  isError: Boolean = false;
  empty: boolean = false

  imagesApi: string = environment.baseUrl + EndPointsEnum.IMAGES


  constructor(
    private dataService: DataService,
    private funcService: FunctionsService,
    private cameraService: CameraService,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadTasks();
  }

  async ionViewWillEnter() {
    this.loadTasks()
    // this.tasks = await this.filterByStatus(this.filterStatus)
  }


  loadTasks(ev?: any) {

    // from Api
    this.dataService.getData(EndPointsEnum.TODOS + (this.skip)).subscribe(async (res: TaskRes[]) => {
      this.dataService.storeData(res);
      // handle refreshing when tasks are already filtered
      this.tasks = (this.filterStatus == 'all') ? res : await this.filterByStatus(this.filterStatus);
      (this.tasks) ? this.showContent(ev) : this.showEmpty(ev)
    });

  }

  async filterByStatus(status: string) {
    this.filterStatus = status
    this.tasks = await this.dataService.getStoredData()
    this.tasks = this.tasks.filter((t) => {
      if (status == 'all') return this.tasks;
      return status == t.status
    })
    this.empty = this.tasks.length ? false : true;
    return this.tasks
  }



  showContent(ev?) {
    this.isLoading = false
    this.isError = false
    this.empty = false

    ev?.target.complete()
  }
  showError(ev?) {
    this.isLoading = false
    this.isError = true
    this.empty = false

    ev?.target.complete()
  }
  showEmpty(ev?) {
    this.isLoading = false
    this.isError = false
    this.empty = true

    ev?.target.complete()
  }

  refresh(event: RefresherCustomEvent) {
    this.isLoading = true;
    this.skip = 1
    this.loadTasks(event)
  }

  toProfile() {
    this.navCtrl.navigateForward('/profile')
  }

  addTask() {
    this.navCtrl.navigateForward('/add')
  }

  toDetails(task: TaskRes) {
    this.dataService.setTask(task);
    this.navCtrl.navigateForward("/details/" + task._id)
  }

  async logout() {
    this.funcService.generalAlert({
      message: 'Sure To Logout this account',
      btns: { ok: 'Ok 👍', no: 'No 👎' }
    }).then(agreed => {
      if (!agreed) return;
      this.authService.logOut();
      this.navCtrl.navigateBack('/login')
    })
  }

}
