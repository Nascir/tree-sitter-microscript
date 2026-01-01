/**
 * @file microScript grammar for tree-sitter
 * @license MIT
 */

module.exports = grammar({
  name: 'microscript',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  inline: $ => [
    $._assignable,
  ],

  conflicts: $ => [
    [$.argument_list, $.parenthesized_expression],
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.variable_declaration,
      $.function_definition,
      $.class_definition,
      $.object_definition,
      $.while_statement,
      $.for_statement,
      $.for_in_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.delete_statement,
      $.do_block,
      $.after_block,
      $.every_block,
      $.sleep_statement,
      $.expression_statement,
    ),

    // Variable declarations (local only - global vars use global.name syntax)
    variable_declaration: $ => seq(
      'local',
      $.identifier,
      optional(seq('=', $._expression)),
    ),

    // Function definition - higher precedence
    function_definition: $ => prec(2, seq(
      field('name', $.identifier),
      '=',
      'function',
      '(',
      optional($.parameter_list),
      ')',
      repeat($._statement),
      'end',
    )),

    // Class definition - higher precedence
    class_definition: $ => prec(2, seq(
      field('name', $.identifier),
      '=',
      'class',
      optional(seq('extends', field('parent', $.identifier))),
      repeat(choice(
        $.constructor_definition,
        $.method_definition,
        $.property_assignment,
      )),
      'end',
    )),

    // Object definition - higher precedence
    object_definition: $ => prec(2, seq(
      field('name', $.identifier),
      '=',
      'object',
      repeat(choice(
        $.method_definition,
        $.property_assignment,
      )),
      'end',
    )),

    _assignable: $ => choice(
      $.identifier,
      $.member_expression,
      $.subscript_expression,
    ),

    elsif_clause: $ => seq(
      'elsif',
      $._expression,
      'then',
      repeat($._statement),
    ),

    else_clause: $ => seq(
      'else',
      repeat($._statement),
    ),

    // While loop
    while_statement: $ => seq(
      'while',
      $._expression,
      repeat($._statement),
      'end',
    ),

    // For loop (range-based)
    for_statement: $ => seq(
      'for',
      $.identifier,
      '=',
      $._expression,
      'to',
      $._expression,
      optional(seq('by', $._expression)),
      repeat($._statement),
      'end',
    ),

    // For-in loop
    for_in_statement: $ => seq(
      'for',
      $.identifier,
      'in',
      $._expression,
      repeat($._statement),
      'end',
    ),

    parameter_list: $ => seq(
      $.parameter,
      repeat(seq(',', $.parameter)),
    ),

    parameter: $ => seq(
      $.identifier,
      optional(seq('=', $._expression)),
    ),

    constructor_definition: $ => seq(
      'constructor',
      '=',
      'function',
      '(',
      optional($.parameter_list),
      ')',
      repeat($._statement),
      'end',
    ),

    // Method name can be identifier or string (for operator overloading like "+" = function...)
    _method_name: $ => choice($.identifier, $.string),

    method_definition: $ => prec(3, seq(
      field('name', $._method_name),
      '=',
      'function',
      '(',
      optional($.parameter_list),
      ')',
      repeat($._statement),
      'end',
    )),

    property_assignment: $ => seq(
      $._method_name,
      '=',
      $._expression,
    ),

    // Return statement
    return_statement: $ => prec.right(seq(
      'return',
      optional($._expression),
    )),

    // Break and continue
    break_statement: $ => 'break',
    continue_statement: $ => 'continue',

    // Delete statement - uses _expression to ensure subscript/member expressions are fully parsed
    delete_statement: $ => seq(
      'delete',
      $._expression,
    ),

    // Async constructs
    do_block: $ => seq(
      'do',
      repeat($._statement),
      'end',
    ),

    _time_unit: $ => choice('second', 'seconds', 'millisecond', 'milliseconds'),

    after_block: $ => seq(
      'after',
      $._expression,
      optional($._time_unit),
      'do',
      repeat($._statement),
      'end',
    ),

    every_block: $ => seq(
      'every',
      $._expression,
      optional($._time_unit),
      'do',
      repeat($._statement),
      'end',
    ),

    sleep_statement: $ => seq(
      'sleep',
      $._expression,
      optional($._time_unit),
    ),

    // Expression statement
    expression_statement: $ => $._expression,

    // Expressions
    _expression: $ => choice(
      $.assignment_expression,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.member_expression,
      $.subscript_expression,
      $.new_expression,
      $.parenthesized_expression,
      $.list_literal,
      $.anonymous_function,
      $.conditional_expression,
      $.identifier,
      $.number,
      $.string,
      $.boolean,
      $.this,
      $.super,
    ),

    // Conditional expression - if-then-else as an expression returning a value
    conditional_expression: $ => prec.right(seq(
      'if',
      field('condition', $._expression),
      'then',
      field('consequence', repeat($._statement)),
      repeat($.elsif_clause),
      optional($.else_clause),
      'end',
    )),

    // Assignment as expression (right associative, lowest precedence)
    assignment_expression: $ => prec.right(0, seq(
      $._assignable,
      choice('=', '+=', '-=', '*=', '/=', '%=', '&=', '|='),
      $._expression,
    )),

    binary_expression: $ => choice(
      // Logical (lowest precedence)
      prec.left(1, seq($._expression, 'or', $._expression)),
      prec.left(2, seq($._expression, 'and', $._expression)),
      // Comparison
      prec.left(3, seq($._expression, choice('==', '!=', '<', '>', '<=', '>='), $._expression)),
      // Bitwise
      prec.left(4, seq($._expression, choice('|', '&'), $._expression)),
      prec.left(5, seq($._expression, choice('<<', '>>'), $._expression)),
      // Additive
      prec.left(6, seq($._expression, choice('+', '-'), $._expression)),
      // Multiplicative
      prec.left(7, seq($._expression, choice('*', '/', '%'), $._expression)),
      // Exponentiation (right associative)
      prec.right(8, seq($._expression, '^', $._expression)),
    ),

    unary_expression: $ => prec.right(9, choice(
      seq('not', $._expression),
      seq('-', $._expression),
    )),

    call_expression: $ => prec(10, seq(
      $._expression,
      '(',
      optional($.argument_list),
      ')',
    )),

    argument_list: $ => seq(
      $._expression,
      repeat(seq(',', $._expression)),
    ),

    member_expression: $ => prec(11, seq(
      $._expression,
      '.',
      $.identifier,
    )),

    subscript_expression: $ => prec(11, seq(
      $._expression,
      '[',
      $._expression,
      ']',
    )),

    new_expression: $ => prec.right(seq(
      'new',
      $.identifier,
      optional(seq('(', optional($.argument_list), ')')),
    )),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    list_literal: $ => seq(
      '[',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ']',
    ),

    anonymous_function: $ => seq(
      'function',
      '(',
      optional($.parameter_list),
      ')',
      repeat($._statement),
      'end',
    ),

    // Literals
    this: $ => 'this',
    super: $ => 'super',

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: $ => token(choice(
      // Hexadecimal
      /0[xX][0-9a-fA-F]+/,
      // Decimal with optional exponent
      /\d+\.?\d*([eE][+-]?\d+)?/,
      /\d*\.\d+([eE][+-]?\d+)?/,
    )),

    string: $ => choice(
      // Triple double-quoted strings (for multi-line, used in JS embedding)
      $.triple_quoted_string,
      // Double-quoted strings
      seq(
        '"',
        repeat(choice(
          token.immediate(/[^"\\]+/),
          $.escape_sequence,
        )),
        '"'
      ),
      // Single-quoted strings
      seq(
        "'",
        repeat(choice(
          token.immediate(/[^'\\]+/),
          $.escape_sequence,
        )),
        "'"
      ),
    ),

    // Triple-quoted strings can contain anything including newlines and quotes
    // They are terminated only by """
    triple_quoted_string: $ => seq(
      '"""',
      optional(alias(/([^"]|"[^"]|""[^"])*/, $.string_content)),
      '"""'
    ),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /[\\'"nrt0]/,
        /x[0-9a-fA-F]{2}/,
        /u[0-9a-fA-F]{4}/,
      ),
    )),

    boolean: $ => choice('true', 'false'),

    // Comments
    comment: $ => token(choice(
      // Line comment
      seq('//', /[^\n]*/),
      // Block comment
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      ),
    )),
  },
});
