import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/firestore';
import { Task } from './app.model';
import { Observable, merge, of, combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export const DB_URL = 'tasks';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public collection: AngularFirestoreCollection<Task>;
  public valueChanges: Observable<Task[]>;
  public snapshotChanges: Observable<{ id: string }[]>;
  public data = new Subject<Task[]>();
  private taskDoc: AngularFirestoreDocument<Task>;

  constructor(private db: AngularFirestore) {
    this.collection = this.db.collection<Task>(DB_URL);
    this.valueChanges = this.collection.valueChanges();
    this.snapshotChanges = this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          return { id };
        });
      })
    );
    this.combineTasks();
  }

  combineTasks() {
    const combined = combineLatest([this.valueChanges, this.snapshotChanges]);
    combined.subscribe(x => {
      const [first, second] = x;
      this.data.next(first.map((item, i) => {
        return { ...item, ...second[i] };
      }) as Task[]);
    });
  }

  addTask(name: string) {
    this.collection.add({ name, completed: false } as Task);
  }

  updateTask(id: string, update: any) {
    this.taskDoc = this.db.doc<Task>(`${DB_URL}/${id}`);
    this.taskDoc.update(update);
  }

  deleteTask(id: string) {
    this.taskDoc = this.db.doc<Task>(`${DB_URL}/${id}`);
    this.taskDoc.delete();
  }
}
