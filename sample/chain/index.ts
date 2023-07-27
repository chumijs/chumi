// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// A -> B -> C -> D -> E -> C
//                  -> C

(() => {
  const test = {
    A: ['A', 'B', 'F'],
    B: ['C', 'E'],
    C: ['D', 'A'],
    D: ['C', 'E', 'B', 'A'],
    E: ['C', 'B', 'A', 'D'],
    F: ['A', 'B', 'C', 'D', 'E', 'F']
  };

  // const test = {
  //   A: ['B'],
  //   B: []
  // };

  for (const key in test) {
    const str = `function ${key}(instance){
    if (instance.start${key}) {
      delete instance.start${key};
      return;
    }
    instance.start${key} = true;
    ${test[key]
      .map((item) => {
        return `instance.${item} = instance.${item} ?? new ${item}(instance);`;
      })
      .join('\n    ')}
   
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        return instance[prop] ?? this[prop]
      }
    });
 };
${key}.prototype.action = () => {
  console.log('hello_${key}')
}
return ${key};
`;
    console.log(str);
    // eslint-disable-next-line no-new-func
    global[key] = new Function(str)();
  }
  const instance = {};
  const firstName = Object.keys(test)[0];
  // eslint-disable-next-line no-new-func
  new Function(`return (instance) => {
    instance.${firstName} = new ${firstName}(instance)
  }`)()(instance);
  console.log(instance);

  instance.A.B.action();
  instance.B.C.action();
  instance.F.A.action();
  instance.F.F.F.F.F.F.action();
})();
