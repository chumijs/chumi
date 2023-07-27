function A(instance): void {
  if (instance.b) {
    return instance.b;
  }
  instance.b = new B(instance);
}

A.prototype.action = () => 'A';

function B(instance): void {
  if (instance.a) {
    console.log(111);
    return instance.a;
  }
  instance.a = new A(instance);
}

B.prototype.action = () => 'B';

const instance: any = { a: {} };
// eslint-disable-next-line no-new
instance.a = new A(instance);

console.log(instance.b);
