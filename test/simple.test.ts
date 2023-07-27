describe('Simple test', () => {
  test('invalid route path', () => {
    try {
      const app = require('./fixtures/simple').default;
      app.listen();
    } catch (error) {
      expect(error.message).toBe(`2 is an invalid routing address definition`);
    }
  });
});
