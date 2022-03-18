var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { SurfaceComponent, SurfaceMode } from '../surface/surface.cmp.js';
import { ToolbarComponent } from '../toolbar/toolbar.cmp.js';
import { TouchController } from '../../services/touchController/touchController.js';
import { downloader, buildPNG } from '../../services/features.js';
import { Shortcut } from '../../services/shortcut/shortcut.js';
let ProjectComponent = class ProjectComponent extends PageComponent {
    constructor(id) {
        var _a, _b;
        super('');
        let projectData = { content: '', height: 15, thickness: 3, width: 15 };
        projectData.thickness = 3;
        const surface = new SurfaceComponent(projectData);
        window.ma = surface; //# Debug purposes
        surface.onResize();
        surface.onChange = () => {
            projectData.content = surface.content.innerHTML;
        };
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(surface);
        this.surface = surface;
        const shortcutBindings = new Shortcut();
        shortcutBindings.on('undo', () => surface.undo());
        shortcutBindings.on('redo', () => surface.redo());
        shortcutBindings.on('move', isOn => surface.setMove(isOn));
        this.shortcutBindings = shortcutBindings;
        const touchHandler = new TouchController(surface.el, false, shortcutBindings);
        touchHandler.on(surface.eventInput);
        window.addEventListener('resize', surface.onResize);
        this.touchHandler = touchHandler;
        const toolbar = new ToolbarComponent();
        (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(toolbar);
        toolbar.on((eventName, eventData) => {
            switch (eventName) {
                case 'finish':
                    document.querySelector('project-page').shadowRoot.querySelector('toolbar-cmp').shadowRoot.querySelector('.timer').innerHTML = "0:00";
                    break
                case 'grid':
                    surface.toggleGrid();
                    break;
                case 'eraser':
                    const newMode = eventData
                        ? SurfaceMode.ERASER_MODE
                        : SurfaceMode.PEN_MODE;
                    surface.setMode(newMode);
                    break;
                case 'download':
                    buildPNG(surface.extractSVG(2, 3000)).then(file => {
                        let filename = 'drawing';
                        filename = filename.replace(/[^a-z0-9]/gi, '_');
                        downloader(file, `${filename}.png`);
                    });
                    break;
            }
        });
        this.toolbar = toolbar;
    }
    exit() {
        window.removeEventListener('resize', this.surface.onResize);
        this.shortcutBindings.destroy();
        this.toolbar.destroy();
        this.touchHandler.destroy();
        this.surface.destroy();
        return super.exit().then(() => { });
    }
};
ProjectComponent = __decorate([
    Component('project-page', './assets/theme/css/project.style.css')
], ProjectComponent);
export { ProjectComponent };
