

export class FeatureName {
  name: string;
  englishTutorial: string;
  frenchTutorial: string;

  constructor() {
    this.name = '';
    this.englishTutorial = '';
    this.frenchTutorial = '';
  }
}


export class Name {
  name: string
  constructor() {
    this.name = '';
  }
}

export class Feature {

  modules: FeatureName[];
  apps: any[];

  constructor() {
    this.modules = [];
    this.apps = [];
  }
}

