import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from 'src/main';

import { ContentContainerComponent } from '@templates/content-container/content-container.component';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, ContentContainerComponent],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    portraitImageSrc!: string;

    ngOnInit() {
        this.downloadImage('images/Alan-0001.jpeg');
    }

    async downloadImage(imagePath: string) {
        try {
            const url = await getDownloadURL(ref(storage, imagePath));

            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
            };
            xhr.open('GET', url.toString());
            xhr.send();

            try {
                this.portraitImageSrc = url;
            }
            catch { }
        } catch (error) {
            // Handle any errors
            console.error(error);
        }
    }
}
