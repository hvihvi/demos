import { addFoo, addFoo1 } from "./immutability";

// BAD
describe("addFoo1", () => {
  // when testing, a side effect is made visible due to no function output
  // mutation is detected by asserting on input values instead of an output
  it("should add foo to array", () => {
    // given
    const array = ["a", "b"];
    // when
    addFoo1(array);
    // then
    expect(array).toEqual(["a", "b", "foo"]);
  });
});

// GOOD
describe("addFoo", () => {
  // using given/when/then pattern to test functions
  // given is the input, passed to the test subject
  // when is the test subject (our function), returns a value
  // then is the expected result, an assertion on the function's return value
  it("should add foo to array", () => {
    // given
    const array = ["a", "b"];
    // when
    const result = addFoo(array);
    // then
    expect(result).toEqual(["a", "b", "foo"]);
  });
});
