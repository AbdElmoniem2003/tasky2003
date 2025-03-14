import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: false
})
export class AddPage implements OnInit {

  statuses: string[] = ['waiting', 'inprogress', 'finished']
  priorities: string[] = ['low', 'medium', 'high']

  constructor() { }

  ngOnInit() {
  }

}
