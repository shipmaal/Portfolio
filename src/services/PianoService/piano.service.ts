import { Injectable } from '@angular/core';
import { Observable, Subject, merge, fromEvent, groupBy, map, distinctUntilChanged, mergeAll } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class PianoService {
    private loadSubject = new Subject<void>();
    private menuSubject = new Subject<[number, boolean, 'menu' | 'piano']>();
    private keySubject = new Subject<[number, boolean]>();
    private routeSubject = new Subject<void>();
    private audioSubject = new Subject<boolean>();

    upSubject$ = new Subject<[string, number]>();
    downSubject$ = new Subject<[string, number]>();

    keyDowns = fromEvent<KeyboardEvent>(document, 'keydown');
    keyUps = fromEvent<KeyboardEvent>(document, 'keyup');

    pianoPresses$ = merge(this.keyDowns, this.keyUps).pipe(
      groupBy((event: any) => event.keyCode),
      map((group: any) => group.pipe(
        distinctUntilChanged((prev: any, curr: any) => prev.type === curr.type)
      )),
      mergeAll()
    );

    pianoActions$ = merge(
      this.upSubject$.asObservable(),
      this.downSubject$.asObservable()
    ).pipe();

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

    sendAudioState(state: boolean) {
        this.audioSubject.next(state);
    }

    getAudioState(): Observable<boolean> {
        return this.audioSubject.asObservable();
    }
}
