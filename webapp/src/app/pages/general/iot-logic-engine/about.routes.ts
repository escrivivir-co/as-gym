import { RouterModule, Routes } from '@angular/router';

import { IotLogicEngineComponent } from './iot-logic-engine.component';

export const routes: Routes = [
  {
    path: '', component: IotLogicEngineComponent, children: [
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
