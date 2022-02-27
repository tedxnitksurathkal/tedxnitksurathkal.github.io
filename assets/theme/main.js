import { ProjectComponent } from './components/project/project.cmp.js';

let appContainer;
const page = new ProjectComponent();
appContainer = document.body.querySelector('.app');
appContainer.innerHTML = '';
appContainer.append(page);
