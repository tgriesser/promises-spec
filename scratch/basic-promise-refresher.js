// Basic Promise refresher:

// When we call resolve...
const p = new Promise((resolve, reject) => {
  resolve(1);
});

// .then is called in the next tick
const promiseA = p.then(function(val) {
  return val + 3;
});

promiseA.then(function(val) {
  console.log(val, val === 4);
});

// ----------------

// .then should allow branching, and call .then in same order they are added
const promiseB = p.then(function(val) {
  return val + 10;
});

promiseB.then(function(val) {
  console.log(val, val === 11);
});

// ----------------

setTimeout(() => {
  // .then should be called, even if the Promise has settled much earlier
  p.then(() => {
    console.log("This is called");
  });
}, 1000);

// ----------------

// If we call both resolve & reject, the promise should settle as the first one called,
// the other should be a no-op, or a warning
const p2 = new Promise((resolve, reject) => {
  reject(new Error());
  resolve(1);
}).then(
  (val) => {
    console.log(val);
  },
  (err) => {
    console.log(err);
  }
);

// ----------------

const p3 = new Promise((resolve) => {
  resolve("Hello World");
});

p3.then()
  .then()
  .then((val) => {
    console.log(val, val === "Hello World");
  });
