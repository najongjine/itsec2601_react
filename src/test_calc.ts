import * as math from "mathjs";

const expression = "2*(2%3)/(7+(2^3)%3)";
console.log(`Testing expression: ${expression}`);

try {
  const result = math.evaluate(expression);
  console.log(`Result: ${result}`);
  console.log(`Formatted: ${math.format(result, { precision: 14 })}`);
} catch (error: any) {
  console.error(`Error: ${error.message}`);
}
