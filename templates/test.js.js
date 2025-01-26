const func = new Function("data", "return data.firstname;");
const person = { firstname: "John", lastname: "Doe" };
console.log(func(person)); // Outputs: "John"
