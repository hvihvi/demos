import { r } from "./readable";

it("should map isTrue", () => {
  const not = (b: boolean) => !b;
  const myConst = true;
  const result = r(myConst)`TRUue`
    .map(not)
    .isTrue()
    .print();
  expect(result).toBe("TRUue mapped by not is not true");
});

it("should map", () => {
  const not = (b: boolean) => !b;
  const myConst = true;
  const result = r(myConst)``
    .map(not)
    .isEqualTo(r("smth else")`something else`)
    .print();
  expect(result).toBe("true mapped by not is not equal to something else");
});

it("should ap", () => {
  const not = (b: boolean) => !b;
  const negation = r(not)`negation`;
  const myConst = true;
  const result = r(myConst)``
    .ap(negation)
    .isEqualTo(r(false)`false`)
    .print();
  expect(result).toBe("true mapped by negation is equal to false");
});
