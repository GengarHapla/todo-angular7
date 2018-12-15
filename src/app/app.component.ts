import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { Task } from './app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  tasks: Subject<Task[]>;

  constructor(private service: AppService) {}

  ngOnInit() {
    this.tasks = this.service.data;
  }

  toggleCompleted(task) {
    // task.completed = !task.completed;
    this.service.updateTask(task.id, { completed: !task.completed });
  }

  delete(task) {
    this.service.deleteTask(task.id);
  }

  editTask(task, { value }) {
    this.service.updateTask(task.id, { name: value });
    task.editing = false;
  }

  ngOnDestroy() {}
}
