; Tags for symbol navigation and code outline
; Compatible with Zed editor and other tools using tree-sitter queries

; Function definitions
(function_definition
  name: (identifier) @name) @definition.function

; Method definitions inside classes/objects
(method_definition
  name: (identifier) @name) @definition.method

; Method definitions with string names (operator overloading)
(method_definition
  name: (string) @name) @definition.method

; Class definitions
(class_definition
  name: (identifier) @name) @definition.class

; Object definitions
(object_definition
  name: (identifier) @name) @definition.object

; Function calls - captures the function being called
(call_expression
  (identifier) @name) @reference.call

; Method calls - captures the method identifier after the dot
(call_expression
  (member_expression
    "." @_
    (identifier) @name)) @reference.call

; Class instantiation with 'new' - captures the class name
(new_expression
  (identifier) @name) @reference.class
