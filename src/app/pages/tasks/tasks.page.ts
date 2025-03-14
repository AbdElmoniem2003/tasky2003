import { Component, OnInit } from '@angular/core';
import { TaskRes } from 'src/core/types/task-res';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false
})
export class TasksPage implements OnInit {

  tasks: TaskRes[] = [{
    title: 'Grocery Shopping App',
    desc: ` This application is designed for super shops. By using
            this application they can enlist all their products in one
            place and can deliver.Customers will get a one- stop
            solution for their daily shopping.`,
    status: 'waiting',
    priority: 'low',
    createdAt: '',
    __v: 0,
    _id: '',
    image: '../../../assets/imgs/default.png',
    user: '',
    updatedAt: '30 June, 2022'
  }];
  statuses: string[] = ['all',  'inprogress','waiting', 'finished']


  constructor() { }

  ngOnInit() {
  }

}
