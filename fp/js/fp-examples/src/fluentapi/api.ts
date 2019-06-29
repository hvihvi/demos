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

  and(them: ItContainer) {
    return new ItContainer(
      this.it && them.it,
      `(${this.itsName} and ${them.itsName})`
    );
  }

  or(them: ItContainer) {
    return new ItContainer(
      this.it || them.it,
      `(${this.itsName} or ${them.itsName})`
    );
  }

  map(fn: (it: boolean) => boolean) {
    const fnName = fn.name ? fn.name : "anonymous function";
    return new ItContainer(
      fn(this.it),
      `(${this.itsName} mapped by ${fnName})`
    );
  }

  eval() {
    return this.it;
  }

  print() {
    return this.it ? this.itsName + " is true" : this.itsName + " is false";
  }
}
