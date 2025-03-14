import { Component, OnInit } from '@angular/core';
import { TaskRes } from 'src/core/types/task-res';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit {

  task: TaskRes

  constructor() { }

  ngOnInit() {
  }

}
