import { RouterModule, Routes } from '@angular/router';

import { AnSindicModelVFComponent } from './asmvf.component';

export const routes: Routes = [
  {
    path: '', component: AnSindicModelVFComponent, children: [
      {
        path: '',
        loadComponent: () => import(`./experience/experience.component`)
          .then(mod => mod.ExperienceComponent)
      },
      {
        path: 'experience',
        loadComponent: () => import(`./experience/experience.component`)
          .then(mod => mod.ExperienceComponent)
      },
      {
        path: 'skill',
        loadComponent: () => import(`./skill/skill.component`)
          .then(mod => mod.SkillComponent)
      },

      {
        path: '**',
        loadComponent: () => import(`./experience/experience.component`)
          .then(mod => mod.ExperienceComponent)
      },
    ]
  },
];
