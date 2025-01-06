export class Name {
  name: string
  constructor() {
    this.name = '';
  }
}

export class Dependency {

  namespaces: Name[];
  sockets: Name[];

  constructor() {
    this.namespaces = [];
    this.sockets = [];
  }
}
