const p = new Promise((resolve, reject) => {
  resolve(1);
});

const a = p
  .then(
    function(a) {
      console.log(a);
    },
    function(b) {
      console.log(b);
    }
  )
  .then(function(a) {});

const b = p.then(function(a) {});
