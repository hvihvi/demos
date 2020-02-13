it("", () => {
  let a = 10;
  let b = a;
  a = 0;
  //expect(b).toBe(?);
});

it("primitive values", () => {
  expect(typeof "hello").toBe("string");
  expect(typeof 1).toBe("number");
  expect(typeof false).toBe("boolean");
  expect(typeof undefined).toBe("undefined");
  expect(typeof null).toBe("object"); // js implem bug: null is a type
});

it("non-primitive values", () => {
  expect(typeof (() => "hello")).toBe("function");
  expect(typeof []).toBe("object");
  expect(typeof {}).toBe("object");
});

it("expressions", () => {
  let a = 10 + 10; // evaluated here
  expect(a).toBe(20);
});

it("immutable primitive values", () => {
  /**
    let reaction = 'yikes';
    reaction[0] = 'l';
    console.log(reaction);
     */

  let arr = [212, 8, 506];
  let str = "hello";
  expect(arr[0]).toBe(212);
  expect(str[0]).toBe("h"); // not an array
  arr[0] = 424;
  expect(arr[0]).toBe(424);
  // str[0] = 'j'; // impossible: silently do nothing if no strict mode

  let answer = true;
  // answer.opposite = false; // not possible
});

it("variables point to values", () => {
  let pet = "Narwhal";
  pet = "The Kraken"; // reassignment not possible with const
  expect(pet).toBe("The Kraken");
});

it("functions receive values", () => {
  const double = x => {
    x = x * 2;
  };

  let money = 10;
  double(money); // money is evaluated here <=> double(10)
  expect(money).toBe(10);

  // not a primitive value
  let pets = ["Tom", "Jerry"];
  const addPet = pets => (pets[2] = "Dog");
  addPet(pets); // we pass the array value, it cannot be changed, but its internals can
  expect(pets).toContain("Tom", "Jerry", "Dog");
});

it("", () => {
  let a = 10;
  let b = a;
  a = 0;
  expect(b).toBe(10);
  /*
    a -----> 10
    b -------^
    then rewire "a", "b"'s wire remains:
    b -----> 10
    a -----> 0
    */
});

it("numbers", () => {
  // loses precision further away from 0
  expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991);
  expect(Number.MAX_SAFE_INTEGER + 1).toBe(9007199254740992);
  expect(Number.MAX_SAFE_INTEGER + 2).toBe(9007199254740992);
  expect(Number.MAX_SAFE_INTEGER + 3).toBe(9007199254740994);
  expect(Number.MAX_SAFE_INTEGER + 4).toBe(9007199254740996);
  expect(Number.MAX_SAFE_INTEGER + 5).toBe(9007199254740996);
  // closest representable value
  expect(0.1 + 0.2 === 0.3).toBe(false);
  expect(0.1 + 0.2 === 0.30000000000000004).toBe(true);
  // special numbers
  let scale = 0;
  expect(1 / scale).toBe(Infinity);
  expect(0 / scale).toBe(NaN);
  expect(-1 / scale).toBe(-Infinity);
  expect(1 / -Infinity).toBe(-0);
  expect(typeof NaN).toBe("number");
  expect(typeof Infinity).toBe("number");
});

it("objects", () => {
  expect(typeof {}).toBe("object");
  expect(typeof []).toBe("object");
  expect(typeof new Date()).toBe("object");
  expect(typeof /\d+/).toBe("object");
  expect(typeof Math).toBe("object");

  // not primitive => not immutable
  const rapper = { name: "Malicious" }; // const doesn't help here
  rapper.name = "Malice"; // Dot notation
  expect(rapper).toEqual({ name: "Malice" });
  rapper["name"] = "No Malice"; // Bracket notation
  expect(rapper).toEqual({ name: "No Malice" });
});

it("functions are values", () => {
  for (let i = 0; i < 7; i++) {
    let dwarf = {};
    console.log(dwarf);
  }
  //Q: how many objects did we create?
  //A: 7 values
  for (let i = 0; i < 7; i++) {
    let dig = function() {
      // Do nothing
    };
    console.log(dig);
  }
  //Q: how many objects did we create?
  //A: 7 values
});
