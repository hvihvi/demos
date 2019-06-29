import { It } from "./api";

describe("It", () => {
  it("should chain isTrue and isFalse and eval to false", () => {
    const myBoolean = true;
    const result = It`myBool`(myBoolean)
      .isTrue()
      .isTrue()
      .isFalse()
      .eval();
    expect(result).toEqual(false);
  });
  it("should print myBool is true", () => {
    const myBoolean = true;
    const result = It`myBool`(myBoolean).print();
    expect(result).toEqual("myBool is true");
  });
  it("should print (((myBool is true) is true) is false) is false", () => {
    const myBoolean = true;
    const result = It`myBool`(myBoolean)
      .isTrue()
      .isTrue()
      .isFalse()
      .print();
    expect(result).toEqual("(((myBool is true) is true) is false) is false");
  });
  it("should eval true and false to false", () => {
    const myTrue = true;
    const myFalse = false;
    const result = It`myTrue`(myTrue)
      .and(It`myFalse`(myFalse))
      .eval();
    expect(result).toEqual(false);
  });
  it("should print (myTrue and myFalse) is true", () => {
    const myTrue = true;
    const myFalse = false;
    const result = It`myTrue`(myTrue)
      .and(It`myFalse`(myFalse))
      .print();
    expect(result).toEqual("(myTrue and myFalse) is false");
  });
});
