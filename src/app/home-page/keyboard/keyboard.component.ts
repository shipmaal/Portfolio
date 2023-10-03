import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PianoService } from './../../piano.service';
import { Subscription } from 'rxjs';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.scss'],
    imports: [CommonModule],
    standalone: true
})
export class KeyboardComponent implements OnInit, AfterViewInit {
    scene: THREE.Scene = new THREE.Scene();
    sceneLoaded = false;

    constructor( private pianoService: PianoService) { }

     LoadEventSub!: Subscription;
     KeyRequestSub!: Subscription;
     mouseStateSub!: Subscription;
     manager!: THREE.LoadingManager;

     pianoRenderer!: THREE.WebGLRenderer;

     clips!: THREE.AnimationClip[];
     lidClip!: THREE.AnimationClip;
     lidMixer!: THREE.AnimationMixer;
     clipNames: string[] = [];
     mixer!: THREE.AnimationMixer;
     clock: THREE.Clock = new THREE.Clock();
     intersectedArray: string[] = [];

     raycaster: THREE.Raycaster = new THREE.Raycaster();
     pointer: THREE.Vector2 = new THREE.Vector2();
     camera!: THREE.PerspectiveCamera;
     menuKeys = ["G.001Action", "A.001Action", "B.001Action", "CAction", "DAction"];

    canvasStyle = { 'cursor': 'default', 'top': '0' };


    ngOnInit(): void {
        window.addEventListener('pointermove', this.onPointerMove);
        this.initFunctions();
    }


    ngAfterViewInit() {
        this.createCanvas();
        this.createPiano();
        console.log(this.scene)
        this.animate();
    }


    initFunctions(pianoService = this.pianoService): void {
        this.pianoService.getLoadEvent().subscribe(() => {
            this.lidup();
        });

        this.pianoService.getKeyRequest().subscribe((key) => {
            this.keyManager(key);
        });

        this.pianoService.getMouseState().subscribe((state) => {
            this.canvasStyle['cursor'] = state;
        });

        this.pianoService.getRouteState().subscribe(() => {
            this.canvasStyle['top'] = '-25vh';
        });


        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = function () {
            setTimeout(() => {
                pianoService.sendLoadEvent();
            }, 2000); // Delay of 2000 milliseconds (2 seconds)
        }
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
        const rect = this.pianoRenderer.domElement.getBoundingClientRect();

        this.pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    }


    createPiano(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 1000);
        this.scene.add(this.camera);

        new EXRLoader()
            .setPath('../../assets/')
            .load('brown_photostudio_04_1k.exr', (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.environment = texture;
            });

        this.createBase();
        this.createKeyboard();

        const light = new THREE.AmbientLight(0xfffada, 0.8);
        this.scene.add(light)
    }


    createBase(): void {
        new GLTFLoader()
            .setPath('../../assets/')
            .load('Piano.glb', (gltf) => {
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

                console.log(this.camera)

                this.scene.add(object);
            });
    }


    createKeyboard(): void {
        new GLTFLoader(this.manager)
            .setPath('../../assets/')
            .load('Keyboard.glb', (gltf) => {
                this.clips = gltf.animations;
                this.clips.forEach((clip: { name: string; }) => {
                    this.clipNames.push(clip.name);
                });

                const object = gltf.scene;
                console.log(object)
                object.children.forEach((key) => {
                    if (key.name.includes('#')) {
                        key.traverse((mesh) => {
                            if (mesh instanceof THREE.Mesh && !(mesh.name.includes('_1'))) {
                                mesh.material.envMapIntensity = 0.25;
                            }
                        })
                    }
                })

                this.mixer = new THREE.AnimationMixer(object);
                this.scene.add(object);
                this.sceneLoaded = true;

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

        requestAnimationFrame(this.animate);
    };


     keyAction(animationName: string, timeScale: number) {
        const clipNum = this.clipNames.indexOf(animationName);
        const action = this.mixer.clipAction(this.clips[clipNum]);

        action.setLoop(THREE.LoopOnce, 1);
        action.paused = false;
        action.clampWhenFinished = true;
        action.timeScale = timeScale;

        action.play();
    }


     keyManager(key: [number, boolean]) {
        const keyIndex = key[0];
        const timeScale = Number(key[1]) * 2 - 1; // turns boolean to 1(down) 0(up) to the appropriate time scale

        const intersectedKey = this.menuKeys[keyIndex];
        this.keyAction(intersectedKey, timeScale);
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


     intersectionCheck() {
        let intersectedName: string;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersected = this.raycaster.intersectObjects(this.scene.children)[0];

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
                const intersectedIndex = this.intersectedArray.indexOf(intersectedKey);

                if (clipNum !== -1) {
                    if (this.menuKeys.includes(intersectedKey)) {
                        const key = this.menuKeys.indexOf(intersectedKey);
                        const down = intersectedIndex !== 0;
                        this.pianoService.sendMenuEvent(key, down);
                    } else {
                        this.keyAction(intersectedKey, (intersectedIndex * 2) - 1);
                    }
                }
            });
        }
    }
}

