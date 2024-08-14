import { Injectable, HostListener, signal } from '@angular/core';
import { filter } from 'rxjs';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { RouterService } from '../RouterService/router.service';
import { PianoService } from '../PianoService/piano.service';
import { ToneService } from '../ToneService/tone.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  scene: THREE.Scene = new THREE.Scene();
  camera!: THREE.PerspectiveCamera;
  manager: THREE.LoadingManager = new THREE.LoadingManager();
  sceneLoaded = false;
  renderer!: THREE.WebGLRenderer;
  clipNames: string[] = [];
  mixer!: THREE.AnimationMixer;
  lidMixer!: THREE.AnimationMixer;
  clips: THREE.AnimationClip[] = [];
  intersectedArray: string[] = [];
  lidClip!: THREE.AnimationClip;
  clock: THREE.Clock = new THREE.Clock();
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  pointer: THREE.Vector2 = new THREE.Vector2();

  isMuted = true;
  muteCount = 0;

  menuKeys: string[] = ["G.001Action", "A.001Action", "B.001Action", "CAction", "DAction"];
  borderKeys: string[] = ['F.001Action', 'EAction']

  cursorStyle = signal('default');
  topStyle = signal('0');

  constructor(private routerService: RouterService, private pianoService: PianoService, private toneService: ToneService) {
    pianoService.getLoadEvent().subscribe(() => {this.lidup()});
    pianoService.getRouteState().subscribe(() => {this.topStyle.set('-25vh')});
    pianoService.getMenuEvent().pipe(
      filter((event) => event[2] === 'menu')
    ).subscribe((event) => {
      if (event[0] < 0 ) {
        this.keyAction(this.borderKeys[-1 * (event[0] + 1)], Number(event[1]));
      } else {
        this.keyAction(this.menuKeys[event[0]], Number(event[1]));
      }
    });
    pianoService.pianoActions$.subscribe((action) => {this.keyboardManager(action[0], action[1])});
    pianoService.pianoPresses$.subscribe((event: KeyboardEvent) => { this.onKeyPress(event, event.type); });

    pianoService.getAudioState().subscribe((state) => {
      this.isMuted = state;
      if (this.muteCount === 0 && !this.isMuted) {
        this.muteCount++;
        toneService.start();
      }
    });

    this.manager.onLoad = function () {pianoService.sendLoadEvent()}
  }

  init(): void {
    window.addEventListener('resize', this.resizeCanvasToDisplaySize);
    window.addEventListener('mousemove', this.onPointerMove);
    this.createCanvas();
    this.createPiano();
    this.animate();
  }

  destroy(): void {
    this.renderer.dispose();
  }

	resizeCanvasToDisplaySize() {
    const canvas = this.renderer.domElement;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove = (event: MouseEvent) => {
    this.toneService.start();
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onKeyPress = (event: KeyboardEvent, action: string) => {
    if (event.repeat || this.routerService.currentRoute !== '/') {
      return;
    }

    const key: string = event.key.toLowerCase();
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

  createCanvas = () => {
    let canvas = document.querySelector("canvas");

    if (!canvas) {
      canvas = document.createElement("canvas");
    }

    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

    this.renderer.setClearColor(0x000000, 1);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
  }

  createPiano(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 1000);
    this.scene.add(this.camera);

    this.loadBaseGLB();
    this.loadKeyboardGLB();

    const light = new THREE.AmbientLight(0xfffada, 3.2);
    this.scene.add(light)
	}

  loadBaseGLB() {
    const baseUrl = 'assets/Base.glb';

    return new GLTFLoader().load(baseUrl, (gltf) => {
      const object = gltf.scene;
      const base = object.children[2];
            
      this.lidClip = gltf.animations[1];
      this.lidMixer = new THREE.AnimationMixer(object);

      this.camera.position.x = base.position.x;
      this.camera.position.y = base.position.y + 184;
      this.camera.position.z = base.position.z + 150;
      this.camera.lookAt(new THREE.Vector3(156, 0, -74));

      this.scene.add(object);
    });
  }

  loadKeyboardGLB() {
    const keyboardUrl = 'assets/Keyboard.glb';
    const backgroundUrl = 'assets/brown_photostudio_04_1k.exr';
    let texture: THREE.Texture;

    new EXRLoader().load(backgroundUrl, (_texture) => {
      _texture.mapping = THREE.EquirectangularReflectionMapping;
      texture =  _texture;
    });

    return new GLTFLoader(this.manager).load(keyboardUrl, (gltf) => {
      this.clips = gltf.animations;
      this.clips.forEach((clip) => {
        this.clipNames.push(clip.name);
      });

      const object = gltf.scene;
      object.children.forEach((key) => {
        if (key.name.includes('#')) {
          key.traverse((mesh) => {
            if (mesh instanceof THREE.Mesh && !(mesh.name.includes('_1'))) {
              mesh.material.envMap = texture;
              mesh.material.envMapIntensity = 0.25;
              mesh.material.needsUpdate = true;
            }
          });
        }
      });

      object.name = 'Keyboard';
      this.mixer = new THREE.AnimationMixer(object);
      this.scene.environment = null;
      this.scene.add(object);
      this.sceneLoaded = true;
    });
  }

  animate = () => {
		this.resizeCanvasToDisplaySize();

		const delta = this.clock.getDelta();
		if (this.mixer) { this.mixer.update(delta); }
		if (this.lidMixer) { this.lidMixer.update(delta); }

		this.render();

		if (this.routerService.currentRoute === '/') {
      requestAnimationFrame(this.animate);
		}
	}

	render = () => {
		this.renderer.render(this.scene, this.camera);

		if (this.sceneLoaded) {
				this.intersectionCheck();
		}
	}

  lidup(): void {
    const action = this.lidMixer.clipAction(this.lidClip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.timeScale = 0.8;
    action.play();
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
          (intersectedAction ? this.pianoService.downSubject$ : this.pianoService.upSubject$).next([intersectedKey, intersectedAction]);
        }
      });
    }
  }

  keyboardManager(intersectedKey: string, intersectedAction: number, interactionType: string = 'mouse') { // action: 0 = up, 1 = down
    if (this.menuKeys.includes(intersectedKey) && interactionType === 'mouse') {
      const key = this.menuKeys.indexOf(intersectedKey);
      const down = intersectedAction !== 0;
      this.pianoService.sendMenuEvent(key, down, 'piano');
      this.cursorStyle.set( down ? 'pointer' : 'default');
    } else if (this.borderKeys.includes(intersectedKey) && intersectedAction === 1) {
      // converts index to -1 or -2 to represent the border keys
      // handled in menu component
      const index = -1 * (this.borderKeys.indexOf(intersectedKey) + 1);
      this.pianoService.sendMenuEvent(index, true, 'piano');
    } else {
      this.keyAction(intersectedKey, intersectedAction);
    }
  }

  keyAction(animationName: string, intersectedAction: number) {
    const timeScale = 1.25 * ((intersectedAction * 2) - 1);
    const clipNum = this.clipNames.indexOf(animationName);
    const action = this.mixer.clipAction(this.clips[clipNum]);
    const noteName = this.parseToNote(animationName);

    if (!this.isMuted) {
      if (timeScale > 0) {
        this.toneService.sampler.triggerAttack(noteName);
      }
      else {
        this.toneService.sampler.triggerRelease(noteName);
      }
    }

    action.setLoop(THREE.LoopOnce, 1);
    action.paused = false;
    action.clampWhenFinished = true;
    action.timeScale = timeScale;

    action.play();
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
