; Scopes - blocks that create new variable scopes

; Function definitions create scopes
(function_definition) @local.scope
(anonymous_function) @local.scope
(method_definition) @local.scope
(constructor_definition) @local.scope

; Class and object definitions create scopes
(class_definition) @local.scope
(object_definition) @local.scope

; Control flow blocks create scopes
(conditional_expression) @local.scope
(elsif_clause) @local.scope
(else_clause) @local.scope
(while_statement) @local.scope
(for_statement) @local.scope
(for_in_statement) @local.scope

; Async blocks create scopes
(do_block) @local.scope
(after_block) @local.scope
(every_block) @local.scope

; Definitions - where variables are defined

; Local variable declarations
(variable_declaration
  "local"
  (identifier) @local.definition)

; Function definitions
(function_definition
  name: (identifier) @local.definition)

; Method definitions
(method_definition
  name: (identifier) @local.definition)

; Class definitions
(class_definition
  name: (identifier) @local.definition)

; Object definitions
(object_definition
  name: (identifier) @local.definition)

; Parameters are local definitions
(parameter
  (identifier) @local.definition)

; For loop variables are local definitions
(for_statement
  (identifier) @local.definition)

(for_in_statement
  (identifier) @local.definition)

; Property assignments in classes/objects
(property_assignment
  (identifier) @local.definition)

; References - where variables are used

; All identifiers are potential references
(identifier) @local.reference
