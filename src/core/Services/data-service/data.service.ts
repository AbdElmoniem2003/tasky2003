import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({ providedIn: 'root' })

export class DataService {

  baseUrl = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }


  getData(endPoint: string): Observable<Object | any> {
    return this.http.get(this.baseUrl + endPoint)
  }

  postData(endPoint: string, body: Object): Observable<Object | any> {
    return this.http.post(this.baseUrl + endPoint, body)
  }

  putData(endPoint: string, body: Object): Observable<Object | any> {
    return this.http.put(this.baseUrl + endPoint, body)
  }

  deleteData(endPoint: string, id: string): Observable<Object | any> {
    return this.http.delete(this.baseUrl + endPoint + id)
  }

  getOne(endPoint: string, id: string): Observable<Object | any> {
    return this.http.get(this.baseUrl + endPoint + id)
  }


}
