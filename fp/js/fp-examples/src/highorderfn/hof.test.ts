import { withCount } from "./hof";

test("high order function should count", () => {
  // given
  const add = (a: number, b: number) => a + b;
  const addToCounter = withCount(add); // don't inline to keep the same counter
  // when
  const result = addToCounter(1);
  // then
  expect(result).toBe(2);
  // and when
  const result2 = addToCounter(1);
  // then
  expect(result2).toBe(3);
});
