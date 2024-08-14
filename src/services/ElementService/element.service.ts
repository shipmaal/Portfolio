import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ElementService {

    constructor() { }

    private headerSubject = new Subject<number>();

    sendHeaderInfo(width: number) {
        this.headerSubject.next(width);
    }

    getHeaderInfo(): Observable<number> {
        return this.headerSubject.asObservable();
    }
}
