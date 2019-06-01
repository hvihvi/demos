// GOOD
// pure
export const add = (a, b) => a + b;

// BAD
// external state
let a = 0;
// BAD
// impure
const addToA = b => (a = a + b);

// BAD
// can be applied to classes too
class AWrapper {
    a = 0
    
    // impure
    someMethod(input) {
        this.a = input;
    }
}

// impure
const insertToDB = (user) => {
    // insert in DB
    dao.insertUser(user);
}


