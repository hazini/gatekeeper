const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

// Replace 'yourFile.js' with the path to your JavaScript file
const inputFilePath = path.join(__dirname, 'backend/public/core.js');
const outputFilePath = path.join(__dirname, 'backend/public/core_modified.js');

// Read the JavaScript file
const code = fs.readFileSync(inputFilePath, 'utf8');

// Parse the code into an AST
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: [
    'jsx',
    'classProperties',
    'objectRestSpread',
    'optionalChaining',
    'nullishCoalescingOperator',
    // Include any other plugins needed for your code
  ],
});

// The code to insert at the beginning of each function
const licenseCheckCode = 'if (!checkLicenseValidity()) return;';

// Parse the license check code into AST nodes
const licenseCheckAst = parser.parse(licenseCheckCode, {
  sourceType: 'module',
  allowReturnOutsideFunction: true, // Added this line
}).program.body[0];

// Function to add the license check to the beginning of function bodies
function addLicenseCheck(path) {
  // Get the function body
  const body = path.node.body;

  // Skip if the function body is not a BlockStatement (e.g., for empty functions)
  if (!t.isBlockStatement(body)) {
    return;
  }

  // Check if the license check is already present
  const firstStatement = body.body[0];
  if (
    firstStatement &&
    t.isIfStatement(firstStatement) &&
    t.isUnaryExpression(firstStatement.test) &&
    firstStatement.test.operator === '!' &&
    t.isCallExpression(firstStatement.test.argument) &&
    t.isIdentifier(firstStatement.test.argument.callee, {
      name: 'checkLicenseValidity',
    })
  ) {
    // License check already exists, skip
    return;
  }

  // Insert the license check at the beginning of the function body
  body.body.unshift(licenseCheckAst);
}

// Traverse the AST and modify function bodies
traverse(ast, {
  // Function Declarations
  FunctionDeclaration(path) {
    addLicenseCheck(path);
  },
  // Function Expressions
  FunctionExpression(path) {
    addLicenseCheck(path);
  },
  // Arrow Functions
  ArrowFunctionExpression(path) {
    // For arrow functions with expression bodies, convert to block statements
    if (!t.isBlockStatement(path.node.body)) {
      path.node.body = t.blockStatement([
        licenseCheckAst,
        t.returnStatement(path.node.body),
      ]);
    } else {
      addLicenseCheck(path);
    }
  },
  // Class Methods
  ClassMethod(path) {
    addLicenseCheck(path);
  },
  // Object Methods
  ObjectMethod(path) {
    addLicenseCheck(path);
  },
});

// Generate the modified code from the AST
const output = generator(ast, { retainLines: true }, code);

// Write the modified code to a new file
fs.writeFileSync(outputFilePath, output.code, 'utf8');

console.log(`Modified file written to ${outputFilePath}`);
