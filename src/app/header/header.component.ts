import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private service: AppService) {}

  ngOnInit() {}

  addTodo({ value }) {
    this.service.addTask(value);
  }
}
