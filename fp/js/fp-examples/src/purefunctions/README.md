# Pure functions

A function is pure if:
1) given the same arguments they give the same output (high predictability, easy to test...)
2) has no side effects

Side effects: changing something somewhere, for example:
- console.log displays something to the console
- insert value in database
- mutate an external variable or an input

## Benefits

Easy to reason about : "given an input I get this output".
Easy to test: given/when/then pattern easy.
No concurrency issues.
Memoizable: since its output is the same for a given input it is possible to cache computed outputs and restore it, saving computation time.
...

## Detect impurity

Functions that returns nothing are either useless or impure. Functions with a signature `anything => void` should be looked into.

## Minimise impurity

It is likely that the side effect can be avoided.
For example, a function that mutates its input can be made pure by having it return a new object and not affect its input.

## Isolate side-effects

It is best to separate pure function logic from side-effect, to make testing and comprehension easier.