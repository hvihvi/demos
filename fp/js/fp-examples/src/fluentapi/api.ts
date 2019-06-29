export const It = (literals: TemplateStringsArray) => (it: boolean) =>
  new ItContainer(it, literals[0]);

class ItContainer {
  it: boolean;
  itsName: string;

  constructor(it: boolean, itsName: string) {
    this.it = it;
    this.itsName = itsName;
  }

  isTrue() {
    return new ItContainer(this.it === true, `(${this.itsName} is true)`);
  }

  isFalse() {
    return new ItContainer(this.it === false, `(${this.itsName} is false)`);
  }

  eval() {
    return this.it;
  }

  print() {
    return this.it ? this.itsName + " is true" : this.itsName + " is false";
  }
}
