import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { CrochetRendererComponent } from '../crochet-renderer/crochet-renderer.component';
import { MapMakerComponent } from '../map-maker/map-maker.component'
import { MusicAnalysisComponent } from '../music-analysis/music-analysis.component';


const componentsMap = {
    PortfolioComponent,
    CrochetRendererComponent,
    MapMakerComponent,
    MusicAnalysisComponent,
}

type ComponentName = keyof typeof componentsMap;

function convertStringToComponent<Name extends ComponentName>(name: Name): (typeof componentsMap)[Name] {
    return componentsMap[name];
}


@Component({
    selector: 'app-content',
  standalone: true,
  templateUrl: './content.component.html',
})
export class ContentComponent implements OnInit {
    @Input() content!: string;

    constructor(private viewContainer: ViewContainerRef) { }

    ngOnInit() {
        this.loadContent(this.content);
    }

    loadContent(name: string) {
        if (this.isValidComponentName(name)) {
            const component = convertStringToComponent(name as ComponentName);
            this.viewContainer.createComponent(component);
        } 
    }

    isValidComponentName(name: string): name is ComponentName {
        return componentsMap.hasOwnProperty(name as ComponentName);
    }
}
