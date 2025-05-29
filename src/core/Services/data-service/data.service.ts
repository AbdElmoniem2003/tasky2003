import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, catchError } from "rxjs";
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage-angular";
import { profileRes } from "src/core/types/profile-res";
import { EndPointsEnum } from "src/core/enums/end_points";
import { TaskRes } from "src/core/types/task-res";
import { FunctionsService } from "../functions-service/functions.service";
import { NewTask } from "src/core/types/task";


@Injectable({ providedIn: 'root' })

export class DataService {

  baseUrl = environment.baseUrl;
  task: TaskRes;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private funcService: FunctionsService
  ) {
    storage.create()
  }


  getData(endPoint: string): Observable<Object | any> {
    return this.http.get(this.baseUrl + endPoint).pipe(take(1), catchError((err) => {
      this.handleDataErrors(err);
      throw err
    }))
  }

  postData(endPoint: string, body: Object): Observable<Object | any> {
    return this.http.post(this.baseUrl + endPoint, body).pipe(take(1), catchError((err) => {
      this.handleDataErrors(err);
      throw err
    }))
  }

  putData(endPoint: string, body: Object): Observable<Object | any> {
    return this.http.put(this.baseUrl + endPoint, body).pipe(take(1), catchError((err) => {
      this.handleDataErrors(err);
      throw err
    }))
  }

  deleteData(endPoint: string, id: string): Observable<Object | any> {
    return this.http.delete(this.baseUrl + endPoint + id).pipe(take(1), catchError((err) => {
      this.handleDataErrors(err);
      throw err
    }))
  }

  getOne(endPoint: string, id: string): Observable<Object | any> {
    return this.http.get(this.baseUrl + endPoint + id).pipe(take(1), catchError((err) => {
      this.handleDataErrors(err);
      throw err
    }))
  }

  handleDataErrors(err) {
    this.funcService.generalToast({ message: err.error.message, color: 'danger' })
  }



  storeUser(logged: profileRes) {
    this.storage.set('logged_user', logged)
  }

  getUser(): Promise<profileRes> {
    return this.storage.get('logged_user')
  }

  storeData(data: TaskRes[] | any) {
    return this.storage.set('tasks', data)
  }

  async getStoredData(): Promise<TaskRes[]> {
    const storedTasks: TaskRes[] = await this.storage.get('tasks')
    return storedTasks
  }

  async storeAddedOne(task: TaskRes) {
    // return new Promise<TaskRes[]>(async (resolve, reject) => {
    task.image = !task.image ? 'path.png' : task.image;
    const storedData = await this.getStoredData();
    storedData.push(task)
    // resolve(storedData)
    this.storeData(storedData)
    // })
  }

  async updateStoredOne(task: TaskRes, id: string) {
    // return new Promise<TaskRes[]>(async (resolve, reject) => {
    // task.image = task.image != 'path.png' ? '' : task.image;
    const storedData = await this.getStoredData();
    const toUpdate = storedData.find(t => { return t._id == id })
    const toUpdateIndex = storedData.indexOf(toUpdate);
    storedData[toUpdateIndex] = task;
    // resolve(storedData);
    this.storeData(storedData)
    // })
  }

  async deleteOneStored(id: string): Promise<void> {
    let tasksStored = await this.getStoredData();

    tasksStored = tasksStored.filter((t) => {
      return id !== t._id
    });
    return this.storeData(tasksStored)
  }

  async storeRefreshToken(token: string) {
    return this.storage.set(EndPointsEnum.REFRESH, token)
  }

  async getRefreshToken() {
    return this.storage.get(EndPointsEnum.REFRESH)
  }
  storeAccessToken(token: string) {
    localStorage.setItem(EndPointsEnum.ACCESS, token)
  }

  getAccessToken() {
    return localStorage.getItem(EndPointsEnum.ACCESS)
  }


  setTask(task: TaskRes) {
    this.task = task
  }

  getTask() {
    return this.task
  }

  clearStorage() {
    localStorage.clear();
    this.storage.clear()
  }


}
