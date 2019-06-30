// no currying
const addNoCurry = (a, b) => a + b;
addNoCurry(1, 2);

// with currying
const add = a => b => a + b;
add(1)(2);
