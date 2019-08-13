export const r = (it: any) => (literals: TemplateStringsArray) =>
  literals[0] ? new Readable(it, literals[0]) : new Readable(it, it);

class Readable {
  it: any;
  itsName: string;

  constructor(it: any, itsName: string) {
    this.it = it;
    this.itsName = itsName;
  }

  isTrue() {
    return !!this.it
      ? new Readable(!!this.it, `${this.itsName} is true`)
      : new Readable(!!this.it, `${this.itsName} is not true`);
  }

  isFalse() {
    return !this.it
      ? new Readable(!this.it, `${this.itsName} is true`)
      : new Readable(!this.it, `${this.itsName} is not true`);
  }

  isEqualTo(them: Readable) {
    return this.it === them.it
      ? new Readable(true, `${this.itsName} is equal to ${them.itsName}`)
      : new Readable(false, `${this.itsName} is not equal to ${them.itsName}`);
  }

  and(them: Readable) {
    return new Readable(
      this.it && them.it,
      `${this.itsName} and ${them.itsName}`
    );
  }

  or(them: Readable) {
    return new Readable(
      this.it || them.it,
      `${this.itsName} or ${them.itsName}`
    );
  }

  map(fn: (it: any) => any) {
    const fnName = fn.name ? fn.name : "anonymous function";
    return new Readable(fn(this.it), `${this.itsName} mapped by ${fnName}`);
  }

  flatMap(fn: (it: any) => Readable) {
    const result = fn(this.it);
    return new Readable(
      result.it,
      `${this.itsName} mapped by ${result.itsName}`
    );
  }

  ap(them: Readable) {
    const result = them.it(this.it);
    return new Readable(result, `${this.itsName} mapped by ${them.itsName}`);
  }

  eval() {
    return this.it;
  }

  print() {
    return this.itsName;
  }
}
