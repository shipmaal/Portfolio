import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../main';


@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    constructor() { }
    portraitImageSrc!: string;

        
    ngOnInit() {
        // Fetch and handle the download URL in ngOnInit or another appropriate lifecycle hook
         this.downloadImage('images/Alan-0001.jpeg');
    }

    async downloadImage(imagePath: string) {
        try {
            const url = await getDownloadURL(ref(storage, imagePath));

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
                // Handle the blob as needed
            };
            xhr.open('GET', url.toString());
            xhr.send();

            const img = document.getElementById('portraitImage');
            if (img != null) {
                this.portraitImageSrc = url;
               /* img.setAttribute('src', url);*/
            }
        } catch (error) {
            // Handle any errors
            console.error(error);
      
        }
    }
}
