package tree_sitter_microscript_test

import (
	"testing"

	"github.com/Nascir/tree-sitter-microscript"
	tree_sitter "github.com/smacker/go-tree-sitter"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_microscript.Language())
	if language == nil {
		t.Errorf("Error loading Microscript grammar")
	}
}
