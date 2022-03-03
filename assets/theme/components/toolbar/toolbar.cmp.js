var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseComponent, Component } from '../base.cmp.js';
import '../helper-tooltip/helper-tooltip.cmp.js';
import { icon } from '../../services/feather.icons.js';
const template = `
  ${icon('clock', 'clockIcon', 'Clock')}
  <span class="timer">3:00</span>
  <span class="split"></span>
  <span data-ref="toggleEraser">
    ${icon('eraser', 'eraserIcon', 'Toggle eraser mode')}
    ${icon('pen', 'penIcon', 'Toggle eraser mode')}
  </span>
  <span class="split"></span>
  ${icon('grid', 'gridEvent', 'Show/hide the canvas grid')}
  <span class="split"></span>
  ${icon('download', 'downloadEvent', 'Download artwork')}
  <span class="split"></span>
  ${icon('info', 'toggleInfoTooltip', 'Toggle info')}
  <helper-tooltip-cmp data-ref="infoTooltip"/>
`;
let ToolbarComponent = class ToolbarComponent extends BaseComponent {
    constructor() {
        var _a, _b, _c, _d;
        super(template);
        this.listeners = [];
        this.isEraserOn = false;
        this.penIcon = SVGElement.prototype;
        this.eraserIcon = SVGElement.prototype;
        // Find 'Event' ref elements to dispatch 
        const refKeys = Array.from(this.refs.keys());
        refKeys.forEach(key => {
            var _a;
            if (!key.endsWith('Event')) {
                return;
            }
            const eventName = key.substr(0, key.length - 5);
            (_a = this.refs.get(key)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                this.listeners.forEach(l => l(eventName, null));
            });
        });
        // Set surface mode
        this.penIcon = this.refs.get('penIcon');
        this.eraserIcon = this.refs.get('eraserIcon');
        this.penIcon.style.display = 'none';
        this.eraserIcon.style.display = 'inherit';
        (_a = this.refs.get('toggleEraser')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.toggleEraser.bind(this));
        // Listen for click on the tooltip toggler
        (_b = this.refs.get('toggleInfoTooltip')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            var _a;
            (_a = this.refs.get('toggleInfoTooltip')) === null || _a === void 0 ? void 0 : _a.classList.toggle('enabled');
        });
        (_c = this.refs.get('infoTooltip')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
            var _a;
            (_a = this.refs.get('toggleInfoTooltip')) === null || _a === void 0 ? void 0 : _a.classList.remove('enabled');
        });
        // Block double tap zoom
        (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.addEventListener('dblclick', e => {
            e.stopPropagation();
            e.preventDefault();
        });
        this.classList.add('unselectable');
    }
    on(listener) {
        this.listeners.push(listener);
    }
    toggleEraser() {
        var _a;
        this.isEraserOn = !this.isEraserOn;
        (_a = this.refs.get('eraser')) === null || _a === void 0 ? void 0 : _a.classList.toggle('on');
        this.listeners.forEach(l => l('eraser', this.isEraserOn));
        this.penIcon.style.display = this.isEraserOn ? 'inherit' : 'none';
        this.eraserIcon.style.display = this.isEraserOn ? 'none' : 'inherit';
    }
    destroy() {
        this.listeners = [];
    }
};
ToolbarComponent = __decorate([
    Component('toolbar-cmp', './assets/theme/css/toolbar.style.css')
], ToolbarComponent);
export { ToolbarComponent };
