import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class PianoService {

    private loadSubject = new Subject<void>();
    private menuSubject = new Subject<[number, boolean, 'menu' | 'piano']>();
    private keySubject = new Subject<[number, boolean]>();
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

    sendMenuEvent(key: number, down: boolean, from: 'menu' | 'piano') {
        this.menuSubject.next([key, down, from]);
    }

    getMenuEvent(): Observable<[number, boolean, 'menu' | 'piano']> {
        return this.menuSubject.asObservable();
    }

    sendRouteState() {
        this.routeSubject.next();
    }

    getRouteState(): Observable<void> {
        return this.routeSubject.asObservable();
    }
}
