# tree-sitter-microscript

[![Build Status](https://github.com/Nascir/tree-sitter-microscript/actions/workflows/ci.yml/badge.svg)](https://github.com/Nascir/tree-sitter-microscript/actions)

Tree-sitter grammar for the [microScript](https://github.com/pmgl/microstudio/wiki) programming language used in [microStudio](https://github.com/pmgl/microstudio).

## What is microScript?

microScript is a simple, elegant scripting language designed for game development in microStudio. It features:

- **Simple syntax** - No semicolons, curly braces, or complex punctuation
- **Functions** - First-class functions with default parameters
- **Classes and objects** - OOP with inheritance and operator overloading
- **Control flow** - `if/then/else/elsif/end`, `while`, `for`, `for..in`
- **Async constructs** - `do`, `after`, `every`, `sleep` for game timing
- **Local variables** - Explicit `local` keyword for scoping

## Installation

```bash
npm install tree-sitter-microscript
```

## Build Commands

```bash
# Install dependencies
npm install

# Generate parser from grammar.js
npm run generate

# Build native bindings
npm run build

# Run tests
npm test

# Parse a file
npm run parse -- <path-to-file.ms>
```

For advanced build options and debugging commands, see [AGENTS.md](AGENTS.md).

## Usage

### Node.js

```javascript
const Parser = require('tree-sitter');
const MicroScript = require('tree-sitter-microscript');

const parser = new Parser();
parser.setLanguage(MicroScript);

const code = `
// Define a greeting function
greet = function(name)
  print("Hello, " + name + "!")
end

// Call the function
greet("World")
`;

const tree = parser.parse(code);
console.log(tree.rootNode.toString());
```

### Tree-sitter CLI

```bash
# Parse a file
tree-sitter parse example.ms

# Run syntax highlighting
tree-sitter highlight example.ms
```

## Supported Features

| Feature | Status |
|---------|--------|
| Functions & closures | Supported |
| Default function parameters | Supported |
| Classes & inheritance | Supported |
| Operator overloading | Supported |
| Object literals | Supported |
| Control flow (if/while/for) | Supported |
| Break/continue statements | Supported |
| Return statements | Supported |
| Delete statement | Supported |
| Async constructs (do/after/every/sleep) | Supported |
| Comments (// and /* */) | Supported |
| String escapes | Supported |
| Triple-quoted strings | Supported |

## Related Projects

- [microScript extension for Zed](https://github.com/zed-extensions/microscript) - Zed editor extension using this grammar
- [microStudio](https://microstudio.dev/) - Online game development platform using microScript

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
