/**
 * Tag-closer extension for CodeMirror.
 *
 * This extension adds an "autoCloseTags" option that can be set to
 * either true to get the default behavior, or an object to further
 * configure its behavior.
 *
 * These are supported options:
 *
 * `whenClosing` (default true)
 *   Whether to autoclose when the '/' of a closing tag is typed.
 * `whenOpening` (default true)
 *   Whether to autoclose the tag when the final '>' of an opening
 *   tag is typed.
 * `dontCloseTags` (default is empty tags for HTML, none for XML)
 *   An array of tag names that should not be autoclosed.
 * `indentTags` (default is block tags for HTML, none for XML)
 *   An array of tag names that should, when opened, cause a
 *   blank line to be added inside the tag, and the blank line and
 *   closing line to be indented.
 *
 * See demos/closetag.html for a usage example.
 */

(function() {
  CodeMirror.defineOption("autoCloseTags", false, function(cm, val, old) {
    if (val && (old == CodeMirror.Init || !old)) {
      var map = {name: "autoCloseTags"};
      if (typeof val != "object" || val.whenClosing)
        map["'/'"] = function(cm) { return autoCloseTag(cm, '/'); };
      if (typeof val != "object" || val.whenOpening)
        map["'>'"] = function(cm) { return autoCloseTag(cm, '>'); };
      cm.addKeyMap(map);
    } else if (!val && (old != CodeMirror.Init && old)) {
      cm.removeKeyMap("autoCloseTags");
    }
  });

  var htmlDontClose = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param",
                       "source", "track", "wbr"];
  var htmlIndent = ["applet", "blockquote", "body", "button", "div", "dl", "fieldset", "form", "frameset", "h1", "h2", "h3", "h4",
                    "h5", "h6", "head", "html", "iframe", "layer", "legend", "object", "ol", "p", "select", "table", "ul"];

  function autoCloseTag(cm, ch) {
    var pos = cm.getCursor(), tok = cm.getTokenAt(pos);
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state), state = inner.state;
    if (inner.mode.name != "xml") return CodeMirror.Pass;

    var opt = cm.getOption("autoCloseTags"), html = inner.mode.configuration == "html";
    var dontCloseTags = (typeof opt == "object" && opt.dontCloseTags) || (html && htmlDontClose);
    var indentTags = (typeof opt == "object" && opt.indentTags) || (html && htmlIndent);

    if (ch == ">" && state.tagName) {
      var tagName = state.tagName;
      if (tok.end > pos.ch) tagName = tagName.slice(0, tagName.length - tok.end + pos.ch);
      var lowerTagName = tagName.toLowerCase();
      // Don't process the '>' at the end of an end-tag or self-closing tag
      if (tok.type == "tag" && state.type == "closeTag" ||
          /\/\s*$/.test(tok.string) ||
          dontCloseTags && indexOf(dontCloseTags, lowerTagName) > -1)
        return CodeMirror.Pass;

      var doIndent = indentTags && indexOf(indentTags, lowerTagName) > -1;
      var curPos = doIndent ? CodeMirror.Pos(pos.line + 1, 0) : CodeMirror.Pos(pos.line, pos.ch + 1);
      cm.replaceSelection(">" + (doIndent ? "\n\n" : "") + "</" + tagName + ">",
                          {head: curPos, anchor: curPos});
      if (doIndent) {
        cm.indentLine(pos.line + 1);
        cm.indentLine(pos.line + 2);
      }
      return;
    } else if (ch == "/" && tok.string == "<") {
      var tagName = state.context && state.context.tagName;
      if (tagName) cm.replaceSelection("/" + tagName + ">", "end");
      return;
    }
    return CodeMirror.Pass;
  }

  function indexOf(collection, elt) {
    if (collection.indexOf) return collection.indexOf(elt);
    for (var i = 0, e = collection.length; i < e; ++i)
      if (collection[i] == elt) return i;
    return -1;
  }
})();

// Highlighting text that matches the selection
//
// Defines an option highlightSelectionMatches, which, when enabled,
// will style strings that match the selection throughout the
// document.
//
// The option can be set to true to simply enable it, or to a
// {minChars, style} object to explicitly configure it. minChars is
// the minimum amount of characters that should be selected for the
// behavior to occur, and style is the token style to apply to the
// matches. This will be prefixed by "cm-" to create an actual CSS
// class name.

(function() {
  var DEFAULT_MIN_CHARS = 2;
  var DEFAULT_TOKEN_STYLE = "matchhighlight";
  
  function State(options) {
    this.minChars = typeof options == "object" && options.minChars || DEFAULT_MIN_CHARS;
    this.style = typeof options == "object" && options.style || DEFAULT_TOKEN_STYLE;
    this.overlay = null;
  }

  CodeMirror.defineOption("highlightSelectionMatches", false, function(cm, val, old) {
    var prev = old && old != CodeMirror.Init;
    if (val && !prev) {
      cm._matchHighlightState = new State(val);
      cm.on("cursorActivity", highlightMatches);
    } else if (!val && prev) {
      var over = cm._matchHighlightState.overlay;
      if (over) cm.removeOverlay(over);
      cm._matchHighlightState = null;
      cm.off("cursorActivity", highlightMatches);
    }
  });

  function highlightMatches(cm) {
    cm.operation(function() {
      var state = cm._matchHighlightState;
      if (state.overlay) {
        cm.removeOverlay(state.overlay);
        state.overlay = null;
      }

      if (!cm.somethingSelected()) return;
      var selection = cm.getSelection().replace(/^\s+|\s+$/g, "");
      if (selection.length < state.minChars) return;

      cm.addOverlay(state.overlay = makeOverlay(selection, state.style));
    });
  }

  function makeOverlay(query, style) {
    return {token: function(stream) {
      if (stream.match(query)) return style;
      stream.next();
      stream.skipTo(query.charAt(0)) || stream.skipToEnd();
    }};
  }
})();

(function(){
  var Pos = CodeMirror.Pos;

  function SearchCursor(cm, query, pos, caseFold) {
    this.atOccurrence = false; this.cm = cm;
    if (caseFold == null && typeof query == "string") caseFold = false;

    pos = pos ? cm.clipPos(pos) : Pos(0, 0);
    this.pos = {from: pos, to: pos};

    // The matches method is filled in based on the type of query.
    // It takes a position and a direction, and returns an object
    // describing the next occurrence of the query, or null if no
    // more matches were found.
    if (typeof query != "string") { // Regexp match
      if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "ig" : "g");
      this.matches = function(reverse, pos) {
        if (reverse) {
          query.lastIndex = 0;
          var line = cm.getLine(pos.line).slice(0, pos.ch), match = query.exec(line), start = 0;
          while (match) {
            start += match.index + 1;
            line = line.slice(start);
            query.lastIndex = 0;
            var newmatch = query.exec(line);
            if (newmatch) match = newmatch;
            else break;
          }
          start--;
        } else {
          query.lastIndex = pos.ch;
          var line = cm.getLine(pos.line), match = query.exec(line),
          start = match && match.index;
        }
        if (match && match[0])
          return {from: Pos(pos.line, start),
                  to: Pos(pos.line, start + match[0].length),
                  match: match};
      };
    } else { // String query
      if (caseFold) query = query.toLowerCase();
      var fold = caseFold ? function(str){return str.toLowerCase();} : function(str){return str;};
      var target = query.split("\n");
      // Different methods for single-line and multi-line queries
      if (target.length == 1) {
        if (!query.length) {
          // Empty string would match anything and never progress, so
          // we define it to match nothing instead.
          this.matches = function() {};
        } else {
          this.matches = function(reverse, pos) {
            var line = fold(cm.getLine(pos.line)), len = query.length, match;
            if (reverse ? (pos.ch >= len && (match = line.lastIndexOf(query, pos.ch - len)) != -1)
                        : (match = line.indexOf(query, pos.ch)) != -1)
              return {from: Pos(pos.line, match),
                      to: Pos(pos.line, match + len)};
          };
        }
      } else {
        this.matches = function(reverse, pos) {
          var ln = pos.line, idx = (reverse ? target.length - 1 : 0), match = target[idx], line = fold(cm.getLine(ln));
          var offsetA = (reverse ? line.indexOf(match) + match.length : line.lastIndexOf(match));
          if (reverse ? offsetA >= pos.ch || offsetA != match.length
              : offsetA <= pos.ch || offsetA != line.length - match.length)
            return;
          for (;;) {
            if (reverse ? !ln : ln == cm.lineCount() - 1) return;
            line = fold(cm.getLine(ln += reverse ? -1 : 1));
            match = target[reverse ? --idx : ++idx];
            if (idx > 0 && idx < target.length - 1) {
              if (line != match) return;
              else continue;
            }
            var offsetB = (reverse ? line.lastIndexOf(match) : line.indexOf(match) + match.length);
            if (reverse ? offsetB != line.length - match.length : offsetB != match.length)
              return;
            var start = Pos(pos.line, offsetA), end = Pos(ln, offsetB);
            return {from: reverse ? end : start, to: reverse ? start : end};
          }
        };
      }
    }
  }

  SearchCursor.prototype = {
    findNext: function() {return this.find(false);},
    findPrevious: function() {return this.find(true);},

    find: function(reverse) {
      var self = this, pos = this.cm.clipPos(reverse ? this.pos.from : this.pos.to);
      function savePosAndFail(line) {
        var pos = Pos(line, 0);
        self.pos = {from: pos, to: pos};
        self.atOccurrence = false;
        return false;
      }

      for (;;) {
        if (this.pos = this.matches(reverse, pos)) {
          if (!this.pos.from || !this.pos.to) { console.log(this.matches, this.pos); }
          this.atOccurrence = true;
          return this.pos.match || true;
        }
        if (reverse) {
          if (!pos.line) return savePosAndFail(0);
          pos = Pos(pos.line-1, this.cm.getLine(pos.line-1).length);
        }
        else {
          var maxLine = this.cm.lineCount();
          if (pos.line == maxLine - 1) return savePosAndFail(maxLine);
          pos = Pos(pos.line + 1, 0);
        }
      }
    },

    from: function() {if (this.atOccurrence) return this.pos.from;},
    to: function() {if (this.atOccurrence) return this.pos.to;},

    replace: function(newText) {
      if (!this.atOccurrence) return;
      var lines = CodeMirror.splitLines(newText);
      this.cm.replaceRange(lines, this.pos.from, this.pos.to);
      this.pos.to = Pos(this.pos.from.line + lines.length - 1,
                        lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0));
    }
  };

  CodeMirror.defineExtension("getSearchCursor", function(query, pos, caseFold) {
    return new SearchCursor(this, query, pos, caseFold);
  });
})();


