/**
 * High order function:
 * 1. takes a function as argument
 * 2. returns a function
 */

// example: count how many times a function was called and pass it as fn argument
export const withCount = fn => {
  let count = 0;
  return (...args) => {
    count++;
    return fn(...args, count);
  };
};

// how do we type them?
const withCountTypedToNumber = (fn: (...i: number[]) => number) => {
  let count = 0;
  return (...args: number[]) => {
    count++;
    return fn(...args, count);
  };
};

function withCountTypedAsGeneric<P, O>(fn: (...i: P[]) => O) {
  let count = 0;
  return function(...args: P[]) {
    count++;
    return fn(...args, count); // TODO fixme
  };
}
