// Test file for pre-commit hook
const test = { name: "test", value: 123, enabled: true };

function badlyFormatted(a: string, b: number) {
  return a + b;
}

export { test, badlyFormatted };
