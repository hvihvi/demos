// BAD
// array mutation example 1
export const addFoo1 = (names: string[]) => {
  names.push("foo");
};

// GOOD
// same solution without mutation
export const addFoo = (names: string[]) => {
  return [...names, "foo"];
};

type Person = {
  name: string;
  age: number;
  sex: Sex;
  gender: Gender;
};

// BAD
// object mutation example 1
const addAge1 = (person: Person) => {
  person.age = person.age + 1;
};

// GOOD
// same solution without mutation
const addAge = (person: Person) => {
  return { ...person, age: person.age + 1 };
};

enum Gender {
  MR = "Monsieur",
  MME = "Madame",
  MLLE = "Mademoiselle"
}

enum Sex {
  M,
  F
}

// BAD
// inner mutation with logic
const addGender1 = (personWithoutGender: Person, married: boolean) => {
  const person = { ...personWithoutGender }; // initialising early is a sign for future mutations
  if (person.sex === Sex.M) {
    person.gender = Gender.MR; // "setter" intent
  }
  if (person.sex === Sex.F) {
    person.gender = married ? Gender.MME : Gender.MLLE;
  }
  return person; // no side effects, but inner mutations make it hard to understad "gender"'s value because it changes over tiem
};

// GOOD
// no inner mutation with logic, return the value instead of mutating
const addGender = (personWithoutGender: Person, married: boolean) => {
  return {
    ...personWithoutGender,
    gender: mapGender(personWithoutGender, married)
  };
};
// GOOD
// extracted pure function, easily testable
const mapGender = (person: Person, married: boolean) => {
  if (person.sex === Sex.M) {
    return Gender.MR; // return value instead of setting it
  }
  if (person.sex === Sex.F) {
    return married ? Gender.MME : Gender.MLLE;
  }
};
