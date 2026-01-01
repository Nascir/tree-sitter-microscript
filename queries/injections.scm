; Injections for embedded languages in microScript

; JavaScript embedding via system.javascript()
; Example: system.javascript(""" console.log('hello') """)
(call_expression
  (member_expression
    (identifier) @_obj
    (identifier) @_method)
  (argument_list
    (string) @injection.content)
  (#eq? @_obj "system")
  (#eq? @_method "javascript")
  (#set! injection.language "javascript")
  (#set! injection.include-children))

; JavaScript file marker: files starting with "// javascript"
; When a file starts with this comment, the rest is JavaScript
; Note: This captures the comment itself; full-file injection is typically
; handled by the editor based on the first line detection
((comment) @injection.content
  (#match? @injection.content "^// javascript")
  (#set! injection.language "javascript"))
