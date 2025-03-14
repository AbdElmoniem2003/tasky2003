import { Component, OnInit } from '@angular/core';
import { TaskRes } from 'src/core/types/task-res';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'], standalone: false

})
export class EditPage implements OnInit {

  statuses: string[] = ['waiting', 'inprogress', 'finished']
  priorities: string[] = ['low', 'medium', 'high']
  taskToEdit: TaskRes = null;

  constructor() { }

  ngOnInit() {

    this.taskToEdit.image = '../../../assets/imgs/default.png'
  }

}
