const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log(a === b);          // ?
console.log(a === c);          // ?
console.log(Object.is(a, b));  // ?
console.log(Object.is(a, c));  // ?

const arr1 = [1, 2];
const arr2 = [1, 2];
const arr3 = arr1;

console.log(arr1 === arr2); // ?
console.log(arr1 === arr3); // ?