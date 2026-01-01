# AGENTS.md

This document provides guidelines for agents working with the tree-sitter-microscript repository.

## Project Overview

**Repository:** https://github.com/Nascir/tree-sitter-microscript

tree-sitter-microscript is a Tree-sitter grammar for the microScript programming language (used in microStudio). The grammar is defined in `grammar.js` and generates the parser in `src/parser.c`. This is a native Node.js addon project with bindings for multiple languages.

## Quick Start

```bash
npm install                          # Install dependencies
npm run generate                     # Generate parser from grammar.js
npm run build                        # Generate parser + compile native bindings
npm test                             # Run all tests
```

## Build Commands

```bash
npm install                          # Install dependencies
npm run generate                     # Generate parser from grammar.js (required after editing grammar.js)
npm run build                        # Generate parser + compile native bindings
npm test                             # Run all tests
npm run parse -- <file.ms>           # Parse a specific file
npx tree-sitter test --filter "name" # Run tests matching a pattern
npx tree-sitter test --update        # Auto-update expected parse trees
npx tree-sitter generate --log       # Generate with conflict logging
```

## File Organization

```
tree-sitter-microscript/
├── grammar.js              # Grammar definition (PRIMARY FILE TO EDIT)
├── src/
│   ├── parser.c            # Auto-generated parser (DO NOT EDIT)
│   ├── grammar.json        # Auto-generated grammar info
│   ├── node-types.json     # Auto-generated node types
│   └── tree_sitter/        # tree-sitter C library
├── bindings/               # Multi-language bindings
│   ├── c/                  # C bindings
│   ├── go/                 # Go bindings
│   ├── node/               # Node.js bindings (index.js entry point)
│   ├── python/             # Python bindings
│   ├── rust/               # Rust bindings
│   └── swift/              # Swift bindings
├── queries/
│   ├── highlights.scm      # Syntax highlighting queries
│   ├── locals.scm          # Scoping queries
│   ├── tags.scm            # Tagging queries
│   ├── indents.scm         # Indentation queries
│   ├── brackets.scm        # Bracket matching queries
│   └── injections.scm      # Language injection queries
├── test/corpus/            # Test files
│   └── *.txt               # Test files with expected parse trees
├── .github/workflows/      # CI/CD configuration
│   └── ci.yml              # GitHub Actions workflow
├── package.json            # Project config & scripts
└── tree-sitter.json        # tree-sitter CLI config
```

## Architecture

**Primary file to edit:** `grammar.js` - defines all language rules

**Auto-generated (DO NOT EDIT):** `src/parser.c`, `src/grammar.json`, `src/node-types.json`

**Query files** (`queries/`): `highlights.scm`, `locals.scm`, `tags.scm`, `indents.scm`, `brackets.scm`, `injections.scm` for IDE support

**Tests** (`test/corpus/*.txt`): Format is `============================================` header, test name, `============================================`, code, `---`, expected S-expression parse tree

## Multi-Language Bindings

The project supports bindings for multiple languages, located in the `bindings/` directory:

| Language | Directory          | Description                     |
|----------|--------------------|---------------------------------|
| Node.js  | `bindings/node/`   | JavaScript/Node.js bindings     |
| C        | `bindings/c/`      | C library bindings              |
| Go       | `bindings/go/`     | Go module bindings              |
| Python   | `bindings/python/` | Python package bindings         |
| Rust     | `bindings/rust/`   | Rust crate bindings             |
| Swift    | `bindings/swift/`  | Swift package bindings          |

Each binding allows the tree-sitter-microscript parser to be used natively in that language's ecosystem.

## CI/CD

GitHub Actions workflow is configured at `.github/workflows/ci.yml`:

- **Triggers:** Push and pull requests to `main` branch
- **Environment:** Ubuntu with Node.js 20
- **Actions:** Runs tests to ensure parser generation and test suite pass

## microScript Language Syntax

### Variables and Types

```microscript
local x = 5
local name = "test"
local flag = true
global.config = [800, 600]  // Global variables use global.name syntax
```

### Functions

```microscript
myFunction = function(a, b)
  return a + b
end

add = function(x, y = 1)
  return x + y
end
```

### Classes

```microscript
MyClass = class extends ParentClass
  constructor = function()
    this.value = 0
  end

  method = function()
    return this.value
  end
end
```

### Objects

```microscript
point = object
  x = 10
  y = 20

  getSum = function()
    return this.x + this.y
  end
end
```

### Control Flow

```microscript
if x > 0 then
  print("positive")
elsif x < 0 then
  print("negative")
else
  print("zero")
end

while i < 10
  i = i + 1
end

for i = 0 to 5
  print(i)
end

for item in list
  print(item)
end
```

### Async Constructs

```microscript
do
  // asynchronous code
end

after 5 seconds do
  // runs after 5 seconds
end

every 1 second do
  // runs every second
end

sleep 0.5
```

### Expressions

```microscript
// Operators (lowest to highest precedence)
x = a or b and c == d or e        // logical
x = a | b & c << d >> e           // bitwise
x = a + b - c * d / e % f         // arithmetic
x = a ^ b                         // exponentiation (right associative)
x = -a not b                      // unary
x = obj.method()                  // call
x = obj.property                  // member access
x = arr[0]                        // subscript
x = new Class(arg)                // instantiation
```

## Grammar Development (grammar.js)

Grammar rules use tree-sitter DSL:

- `prec(n, ...)` / `prec.left(n, ...)` / `prec.right(n, ...)` - precedence (higher = tighter binding)
- `seq(...)` - sequential patterns
- `choice(...)` - alternatives
- `field('name', ...)` - named captures
- `inline: $ => [...]` - inline rules for performance
- `conflicts: $ => [...]` - array of potential conflicts

### Operator Precedence (in grammar.js)

Higher precedence = binds tighter = appears later in expression chain:

```
0  = Assignment (=, +=, -=, etc.)
1  = or
2  = and
3  = Comparison (==, !=, <, >, <=, >=)
4  = Bitwise (|, &)
5  = Bitwise shift (<<, >>)
6  = Additive (+, -)
7  = Multiplicative (*, /, %)
8  = Exponentiation (^)
9  = Unary (not, -)
10 = Call expressions
11 = Member access, subscript
```

### Rule Naming Conventions

- External/private rules: leading underscore (`_expression`, `_statement`)
- Helper rules: snake_case (`parameter_list`)
- Generated node types: snake_case in output

### Comments

Top-level rule descriptions use JSDoc style comments:

```javascript
/**
 * @file microScript grammar for tree-sitter
 * @license MIT
 */
```

## Code Style Guidelines

### C Code (src/parser.c)

- **DO NOT EDIT** - This file is auto-generated by `tree-sitter generate`
- Only modify `src/tree_sitter/alloc.h` or `src/tree_sitter/array.h` if needed

### JavaScript (bindings/node/)

- Use strict mode
- Use `const` over `let`, avoid `var`
- Use ES6+ syntax
- Simple module exports pattern

## Testing

1. Create test files in `test/corpus/` directory with `.txt` extension
2. Format: `============================================` header, test name on next line, `============================================`, then source code, then `---` and expected S-expression parse tree
3. Run `npm test` to execute all tests
4. Use `npx tree-sitter test --filter "name"` for single test
5. Use `npx tree-sitter test --update` to auto-update expected trees

## Common Tasks

### Add a new expression type

1. Add rule to `grammar.js` under `_expression` choice
2. Add precedence if needed using `prec()` or `prec.left/right`
3. Run `npm run generate && npm test`

### Add a new statement type

1. Add rule to `grammar.js` under `_statement` choice
2. Run `npm run generate && npm test`

### Modify existing rule

1. Edit the rule in `grammar.js`
2. Run `npm run generate && npm test`
3. If tests fail, regenerate with `npm run generate`

### Add or modify query files

1. Edit the relevant `.scm` file in `queries/`
2. Test with an editor that uses tree-sitter (e.g., Neovim)
3. Run `npx tree-sitter test` to verify queries don't break parsing

## Error Handling

- **Grammar errors during generation:** Check `grammar.js` syntax and rule references
- **Parse errors:** Usually indicate missing grammar rules or precedence issues
- **Build errors:** Ensure node-gyp and C compiler are available
- **Conflicts during generation:** Run `npx tree-sitter generate --log` to see conflict details

## Debugging

```bash
# View current parse tree for a file
npx tree-sitter parse file.ms

# Log conflicts during generation
npx tree-sitter generate --log

# Generate parser only
npm run generate

# Build native bindings
npm run build

# Parse with syntax highlighting output
npx tree-sitter parse --html file.ms > output.html
```

## Related Projects

- **Zed Extension:** https://github.com/zed-extensions/microscript - A Zed editor extension that uses this tree-sitter grammar for microScript syntax highlighting and language support

## Dependencies

- `tree-sitter-cli`: Development tool for generating parsers and running tests
- `tree-sitter`: Peer dependency for runtime
- `node-addon-api`: Node.js addon API for native bindings
- `node-gyp-build`: Build tool for native Node.js modules
