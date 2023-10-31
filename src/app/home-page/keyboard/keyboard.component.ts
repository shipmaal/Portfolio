import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { PianoService } from '@services/piano.service';
import { Subscription, fromEvent, filter, merge, groupBy, map, distinctUntilChanged, mergeAll, Observable, Subject, throttleTime, debounceTime, bufferCount } from 'rxjs';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

import * as Tone from 'Tone';


@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.scss'],
    imports: [CommonModule],
    standalone: true
})
export class KeyboardComponent implements OnInit, AfterViewInit, OnDestroy {
    scene: THREE.Scene = new THREE.Scene();
    sceneLoaded = false;

    LoadEventSub!: Subscription;
    KeyRequestSub!: Subscription;
    mouseStateSub!: Subscription;

    manager: THREE.LoadingManager = new THREE.LoadingManager();
    pianoRenderer!: THREE.WebGLRenderer;

    clips: THREE.AnimationClip[] = [];
    lidClip!: THREE.AnimationClip;
    lidMixer!: THREE.AnimationMixer;
    clipNames: string[] = [];
    mixer!: THREE.AnimationMixer;
    clock: THREE.Clock = new THREE.Clock();
    intersectedArray: string[] = [];
    raycaster: THREE.Raycaster = new THREE.Raycaster();
    pointer: THREE.Vector2 = new THREE.Vector2();
    camera!: THREE.PerspectiveCamera;

    menuKeys: string[] = ["G.001Action", "A.001Action", "B.001Action", "CAction", "DAction"];
    canvasStyle: { [key: string]: string } = { 'cursor': 'default', 'top': '0' };
    currentRoute: string;

    sampler: Tone.Sampler = new Tone.Sampler({
        urls: {
            "C3": "C3.mp3",
            "D#3": "Ds3.mp3",
            "F#3": "Fs3.mp3",
            A3: "A3.mp3",
            C4: "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3"
        },
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    upSubject$ = new Subject<[string, number]>();
    downSubject$ = new Subject<[string, number]>();

    pianoPresses$: Observable<unknown>;
    pianoActions$ = merge(
        this.upSubject$.asObservable(),
        this.downSubject$.asObservable()
    ).pipe();

    pianoBuffer$ = this.pianoActions$.pipe(bufferCount(10)); // check time between key presses?

    constructor(private pianoService: PianoService, private router: Router) {
        this.currentRoute = this.router.url;

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.currentRoute = this.router.url;
            });


        this.pianoService.getLoadEvent().subscribe(() => {
            this.lidup();
        });

        this.pianoService.getMouseState().subscribe((state) => {
            this.canvasStyle['cursor'] = state;
        });

        this.pianoService.getRouteState().subscribe(() => {
            this.canvasStyle['top'] = '-25vh';
        });

        this.manager.onLoad = function () {
            pianoService.sendLoadEvent();
        }

        this.pianoActions$.subscribe((action) => {
            this.keyboardManager(action[0], action[1]);
        });

        this.pianoBuffer$.subscribe((actions) => {
            console.log(actions)
        });

        const keyDowns = fromEvent<KeyboardEvent>(document, 'keydown');
        const keyUps = fromEvent<KeyboardEvent>(document, 'keyup');

        this.pianoPresses$ = merge(keyDowns, keyUps).pipe(
            groupBy((event: any) => event.keyCode),
            map((group: any) => group.pipe(
                distinctUntilChanged((prev: any, curr: any) => prev.type === curr.type)
            )),
            mergeAll()
        );

        this.pianoPresses$.subscribe((event: any) => {
            this.onKeyPress(event, event.type);
        });
    }


    ngOnInit(): void {
        window.addEventListener('pointermove', this.onPointerMove);
    }


    ngAfterViewInit() {
        this.createCanvas();
        this.createPiano();
        this.animate();
    }


    ngOnDestroy() {
       
    }


    createCanvas = () => {
        let canvas = document.querySelector("canvas");

        if (!canvas) {
            canvas = document.createElement("canvas");
        }

        this.pianoRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

        this.pianoRenderer.setClearColor(0x000000, 1);
        const pmremGenerator = new THREE.PMREMGenerator(this.pianoRenderer);
        pmremGenerator.compileEquirectangularShader();

        this.pianoRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.pianoRenderer.toneMappingExposure = 1;
    }


    resizeCanvasToDisplaySize() {
        const canvas = this.pianoRenderer.domElement;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (canvas.width !== width || canvas.height !== height) {
            this.pianoRenderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }


    onPointerMove = (event: MouseEvent) => {
        Tone.start();
        const rect = this.pianoRenderer.domElement.getBoundingClientRect();

        this.pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    }


    onKeyPress = (event: KeyboardEvent, action: string) => {
        if (event.repeat || this.currentRoute !== '/') {
            return;
        }

        const key: string = event.key;
        const keyConversion: { [key: string]: string } = {
            'z': 'A.000Action',
            'x': 'A#.000Action',
            'c': 'B.000Action',
            'v': 'C.001Action',
            'q': 'C#.001Action',
            'a': 'D.001Action',
            'w': 'D#.001Action',
            's': 'E.001Action',
            'd': 'F.001Action',
            'r': 'F#.001Action',
            'f': 'G.001Action',
            't': 'G#.001Action',
            'g': 'A.001Action',
            'y': 'A#.001Action',
            'h': 'B.001Action',
            'j': 'CAction',
            'i': 'C#Action',
            'k': 'DAction',
            'o': 'D#Action',
            'l': 'EAction',
            ';': 'FAction',
            '[': 'F#Action',
            "'": 'GAction',
            ']': 'G#Action',
            'm': 'AAction',
            ',': 'A#Action',
            '.': 'BAction',
            '/': 'C.000Action',
        }


        action = action.replace('keydown', '1');
        action = action.replace('keyup', '0');
        this.keyboardManager(keyConversion[key], Number(action), 'key');
    }


    async createPiano(): Promise<void> {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 1000);
        this.scene.add(this.camera);

        try {
            await this.loadEXRBackground();
            await this.loadBaseGLB();
            await this.loadKeyboardGLB();
        } catch (error) {
            console.error('Error loading model file:', error);
        }

        const light = new THREE.AmbientLight(0xfffada, 0.8);
        this.scene.add(light)
    }


    async loadEXRBackground() {
        //const backgroundUrl = await this.downloadFile('assets/brown_photostudio_04_1k.exr');
        const backgroundUrl = 'assets/brown_photostudio_04_1k.exr';

        return new Promise((resolve, reject) => {
            new EXRLoader().load(backgroundUrl, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.environment = texture;
                resolve(texture);
            }, undefined, reject);
        });
    }

    
    async loadBaseGLB() {
        //const baseUrl = await this.downloadFile('assets/Base.glb');
        const baseUrl = 'assets/Base.glb';

        return new Promise<void>((resolve, reject) => {
            new GLTFLoader().load(baseUrl, (gltf) => {
                const object = gltf.scene;
                const base = object.children[2];

                object.traverse((subObject) => {
                    if (subObject instanceof THREE.Mesh) {
                        subObject.material.envMapIntensity = 0;
                    }
                });

                this.lidClip = gltf.animations[1];
                this.lidMixer = new THREE.AnimationMixer(object);

                this.camera.position.x = base.position.x;
                this.camera.position.y = base.position.y + 184;
                this.camera.position.z = base.position.z + 150;
                this.camera.lookAt(new THREE.Vector3(156, 0, -74));

                this.scene.add(object);
                resolve();
            }, undefined, reject);
        });
    }


    async loadKeyboardGLB() {
        //const keyboardUrl = await this.downloadFile('assets/Keyboard.glb');
        const keyboardUrl = 'assets/Keyboard.glb';

        return new Promise<void>((resolve, reject) => {
            new GLTFLoader(this.manager).load(keyboardUrl, (gltf) => {
                this.clips = gltf.animations;
                this.clips.forEach((clip) => {
                    this.clipNames.push(clip.name);
                });

                const object = gltf.scene;
                object.children.forEach((key) => {
                    if (key.name.includes('#')) {
                        key.traverse((mesh) => {
                            if (mesh instanceof THREE.Mesh && !(mesh.name.includes('_1'))) {
                                mesh.material.envMapIntensity = 0.25;
                            }
                        });
                    }
                });

                this.mixer = new THREE.AnimationMixer(object);
                this.scene.add(object);
                this.sceneLoaded = true;
                resolve();
            }, undefined, reject);
        });
    }


    animate = () => {
        this.resizeCanvasToDisplaySize();

        const delta = this.clock.getDelta();
        if (this.mixer) { this.mixer.update(delta); }
        if (this.lidMixer) {
            this.lidMixer.update(delta);
        }

        this.render();


        if (this.currentRoute === '/') {
            requestAnimationFrame(this.animate);

        }
    }


    lidup(): void {
        const action = this.lidMixer.clipAction(this.lidClip);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.timeScale = 0.8;
        action.play();
    }


    render = () => {
        this.pianoRenderer.render(this.scene, this.camera);

        if (this.sceneLoaded) {
            this.intersectionCheck();
        }
    }


    keyAction(animationName: string, timeScale: number) {
        const clipNum = this.clipNames.indexOf(animationName);
        const action = this.mixer.clipAction(this.clips[clipNum]);
        const noteName = this.parseToNote(animationName);

        if (timeScale > 0) {
            this.sampler.triggerAttack(noteName);
        }
        else {
            this.sampler.triggerRelease(noteName);
        }

        action.setLoop(THREE.LoopOnce, 1);
        action.paused = false;
        action.clampWhenFinished = true;
        action.timeScale = timeScale;

        action.play();
    }


    keyboardManager(intersectedKey: string, intersectedAction: number, interactionType: string = 'mouse') { // action: 0 = up, 1 = down
        const timeScale = 1.25 * ((intersectedAction * 2) - 1);
        this.keyAction(intersectedKey, timeScale);

        if (this.menuKeys.includes(intersectedKey) && interactionType === 'mouse') {
            const key = this.menuKeys.indexOf(intersectedKey);
            const down = intersectedAction !== 0;
            this.pianoService.sendMenuEvent(key, down);
        }
    }


    intersectionCheck() { // expirement with rxjs throttling to stop really fast trills! //// throttling does not work:( need to do something more clever booooo
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersected = this.raycaster.intersectObjects(this.scene.children)[0];

        let intersectedName: string;

        try {
            if (intersected.object.name.includes('Key')) {
                intersectedName = intersected.object.parent?.name + "";
            } else {
                intersectedName = intersected.object.name + "";
            }
        } catch {
            intersectedName = "Scene";
        }

        if (intersectedName.includes('#0')) {
            intersectedName = intersectedName.slice(0, 2) + "." + intersectedName.slice(2);
        } else if (intersectedName.includes('0')) {
            intersectedName = intersectedName.slice(0, 1) + "." + intersectedName.slice(1);
        }

        intersectedName += "Action";

        if (this.intersectedArray.length < 2) {
            this.intersectedArray.push(intersectedName);
        } else {
            const prevIntersected = this.intersectedArray[1];
            this.intersectedArray = [prevIntersected, intersectedName];
        }

        if (this.intersectedArray[0] !== this.intersectedArray[1]) {
            this.intersectedArray.forEach((intersectedKey) => {
                const clipNum = this.clipNames.indexOf(intersectedKey);
                const intersectedAction = this.intersectedArray.indexOf(intersectedKey);

                if (clipNum !== -1) {
                    (intersectedAction ? this.downSubject$ : this.upSubject$).next([intersectedKey, intersectedAction]);
                }
            });
        }
    }


    parseToNote(animationName: string): string {
        if (animationName === 'C.000Action') {
            animationName = 'C5'
        }
        if (animationName.includes('000')) {
            animationName = animationName.replace('.000Action', '2');
        }

        else if (animationName.includes('001')) {
            animationName = animationName.replace('.001Action', '3');
        }

        else {
            animationName = animationName.replace('Action', '4');
        }

        return animationName
    }
}
