export const r = (it: any) => (literals: TemplateStringsArray) =>
  literals[0] ? new Readable(it, literals[0]) : new Readable(it, it);

class Readable<A> {
  it: A;
  itsName: string;

  constructor(it: A, itsName: string) {
    this.it = it;
    this.itsName = itsName;
  }

  isTrue(): Readable<boolean> {
    return !!this.it
      ? new Readable(!!this.it, `${this.itsName} is true`)
      : new Readable(!!this.it, `${this.itsName} is not true`);
  }

  isFalse(): Readable<boolean> {
    return !this.it
      ? new Readable(!this.it, `${this.itsName} is true`)
      : new Readable(!this.it, `${this.itsName} is not true`);
  }

  isEqualTo(them: Readable<A>): Readable<boolean> {
    return this.it === them.it
      ? new Readable(true, `${this.itsName} is equal to ${them.itsName}`)
      : new Readable(false, `${this.itsName} is not equal to ${them.itsName}`);
  }

  and<B>(them: Readable<B>): Readable<boolean> {
    return new Readable(
      !!this.it && !!them.it,
      `${this.itsName} and ${them.itsName}`
    );
  }

  or<B>(them: Readable<B>): Readable<boolean> {
    return new Readable(
      !!this.it || !!them.it,
      `${this.itsName} or ${them.itsName}`
    );
  }

  map<B>(fn: (it: A) => B): Readable<B> {
    const fnName = fn.name ? fn.name : "anonymous function";
    return new Readable(fn(this.it), `${this.itsName} mapped by ${fnName}`);
  }

  flatMap<B>(fn: (it: A) => Readable<B>): Readable<B> {
    const result = fn(this.it);
    return new Readable(
      result.it,
      `${this.itsName} mapped by ${result.itsName}`
    );
  }

  ap<B>(them: Readable<(it: A) => B>): Readable<B> {
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
