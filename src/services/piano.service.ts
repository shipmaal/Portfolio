import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class PianoService {

    private loadSubject = new Subject<void>();
    private menuSubject = new Subject<[number, boolean]>();
    private keySubject = new Subject<[number, boolean]>();
    private cursorSubject = new Subject<string>();
    private routeSubject = new Subject<void>();

    sendLoadEvent() {
        this.loadSubject.next();
    }

    getLoadEvent(): Observable<void> {
        return this.loadSubject.asObservable();
    }

    sendKeyRequest(key: number, down: boolean) {
        this.keySubject.next([key, down]);
    }

    getKeyRequest(): Observable<[number, boolean]> {
        return this.keySubject.asObservable();
    }

    sendMenuEvent(key: number, down: boolean) {
        this.menuSubject.next([key, down]);
    }

    getMenuEvent(): Observable<[number, boolean]> {
        return this.menuSubject.asObservable();
    }

    sendMouseState(state: string) {
        this.cursorSubject.next(state);
    }

    getMouseState(): Observable<string> {
        return this.cursorSubject.asObservable();
    }

    sendRouteState() {
        this.routeSubject.next();
    }

    getRouteState(): Observable<void> {
        return this.routeSubject.asObservable();
    }
}
