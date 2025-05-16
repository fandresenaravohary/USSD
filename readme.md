# USSD MyTel – USSD Service Simulation in TypeScript

This project simulates an interactive USSD service in a command-line interface. It allows users to navigate a USSD menu to check their balance, recharge an account, withdraw or transfer money. The code is written in TypeScript and runs via Node.js.

## Features

* Start a session using the USSD code `*123#`
* Interactive main menu with options:

  1. Check balance
  2. Recharge a number
  3. Withdraw money
  4. Transfer money
  5. Exit the service
* Input validation:

  * Phone number format must be `03XXXXXXXX` or `04XXXXXXXX`
  * Amounts must be strictly positive
* Error handling (insufficient balance, invalid format, etc.)
* Back navigation using `*` or `BACK` and timeout handling (`TIMEOUT`)
* Modular architecture (services, models, utilities)

## Development Conventions

The ESLint configuration uses `@typescript-eslint` and enforces the following rules:

```jsonc
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      { "selector": "default",      "format": ["camelCase"] },
      { "selector": "variableLike", "format": ["camelCase"] },
      { "selector": "function",     "format": ["camelCase"] },
      { "selector": "parameter",    "format": ["camelCase"] },
      { "selector": "memberLike",   "modifiers": ["private"], "format": ["camelCase"] },
      { "selector": "typeLike",     "format": ["PascalCase"] }
    ],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Installation & Usage

Make sure you have Node.js (v18 or higher) and npm installed. Then follow these steps:

```bash
# Clone the repository
git clone https://github.com/<your-username>/mytel-ussd.git

cd mytel-ussd

# Install dependencies
npm install

# Compile the TypeScript code
npm run build

# Start the application
npm start
```

## Sample Session

```text
Welcome to the MyTel USSD service.
Enter a USSD code to start

USSD Code: *123#

MyTel Main Menu (*123#)
1. Check balance
2. Recharge a number
3. Withdraw money
4. Transfer money
0. Exit the service
```

## Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm start`     | Runs the application         |
| `npm run build` | Compiles TypeScript files    |
| `npm run lint`  | Runs ESLint for code quality |

## License

This project was developed as part of an academic assignment. Any reuse in production must credit the author.

## Author

Fandresena Ravohary
