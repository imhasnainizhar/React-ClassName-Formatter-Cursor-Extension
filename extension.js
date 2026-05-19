// @ts-check
"use strict";

const vscode = require("vscode");

const JSX_LANGUAGES = [
  "javascriptreact",
  "typescriptreact",
  "javascript",
  "typescript",
];

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("✅ className Template Literal extension active");

  // ════════════════════════════════════════════════════════════════════════════
  // 1. COMPLETION PROVIDER
  // ════════════════════════════════════════════════════════════════════════════
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    JSX_LANGUAGES,
    {
      provideCompletionItems(document, position) {
        const lineText = document.lineAt(position).text;
        const prefix = lineText.substring(0, position.character);

        const wordMatch = prefix.match(/([a-zA-Z]+)$/);
        if (!wordMatch) return undefined;

        const typedWord = wordMatch[1];

        if (typedWord.length < 1 || !"className".startsWith(typedWord)) {
          return undefined;
        }

        const wordStart = new vscode.Position(
          position.line,
          position.character - typedWord.length
        );
        const wordRange = new vscode.Range(wordStart, position);

        const templateItem = new vscode.CompletionItem(
          "className",
          vscode.CompletionItemKind.Snippet
        );

        templateItem.range = wordRange;
        templateItem.insertText = new vscode.SnippetString('className={`$1`}');
        templateItem.detail = "className={``} (Template Literal)";
        templateItem.documentation = new vscode.MarkdownString("Inserts template literal className for dynamic strings.");
        templateItem.sortText = "\0";
        templateItem.preselect = true;

        return [templateItem];
      },
    }
  );

  // ════════════════════════════════════════════════════════════════════════════
  // 2. AGGRESSIVE ON-TYPE INTERCEPTOR 
  // ════════════════════════════════════════════════════════════════════════════
  const documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document !== event.document) return;
    if (!JSX_LANGUAGES.includes(event.document.languageId)) return;
    if (event.contentChanges.length === 0) return;

    for (const change of event.contentChanges) {
      if (
        change.text.includes("className=") ||
        change.text.includes('"') ||
        change.text.includes("'")
      ) {
        const lineNo = change.range.start.line;

        setTimeout(() => {
          const ed = vscode.window.activeTextEditor;
          if (!ed || ed.document !== event.document) return;

          const lineText = ed.document.lineAt(lineNo).text;
          const match = lineText.match(/className=(["'])((?:(?!\1).)*)\1/);
          if (!match || match.index === undefined) return;

          const replaceRange = new vscode.Range(
            new vscode.Position(lineNo, match.index),
            new vscode.Position(lineNo, match.index + match[0].length)
          );

          const inner = match[2];

          ed.insertSnippet(
            new vscode.SnippetString(inner ? `className={\`${inner}$1\`}` : 'className={`$1`}'),
            replaceRange
          );
        }, 15);
        break;
      }
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 3. FORMATTER COMMAND (Multi-line Aligned Indentation & Word Wrapping)
  // ════════════════════════════════════════════════════════════════════════════
  const formatCommand = vscode.commands.registerCommand(
    "classNameTemplateLiteral.formatFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const doc = editor.document;
      if (!JSX_LANGUAGES.includes(doc.languageId)) return;

      const edits = [];
      let count = 0;
      
      const text = doc.getText();
      const PATTERN = /className=(?:(["'])((?:(?!\1).)*)\1|\{\s*`([^`]*)`\s*\})/g;

      let m;
      PATTERN.lastIndex = 0;

      while ((m = PATTERN.exec(text)) !== null) {
        const fullMatch = m[0];
        
        // Group 2 is for static quotes, Group 3 is for existing backticks
        const inner = m[2] !== undefined ? m[2] : m[3]; 
        
        // Skip if the string already has JS logic like `${isActive}` to avoid breaking code
        if (inner.includes("${")) continue;

        // 🌟 1. Find the exact base indentation of the line (e.g. where the <div starts)
        const startPos = doc.positionAt(m.index);
        const lineText = doc.lineAt(startPos.line).text;
        const baseIndentMatch = lineText.match(/^\s*/);
        const baseIndent = baseIndentMatch ? baseIndentMatch[0] : "";

        // 🌟 2. Detect user's VS Code Settings (Tabs vs Spaces)
        const tabSize = typeof editor.options.tabSize === 'number' ? editor.options.tabSize : 4;
        const insertSpaces = editor.options.insertSpaces !== false;
        const tabStr = insertSpaces ? " ".repeat(tabSize) : "\t";

        // 🌟 3. Calculate Perfect Alignments
        const backtickIndent = baseIndent + tabStr;         // 1 tab inward from <div
        const innerWrapIndent = backtickIndent + " ";       // +1 space to align wrapped text inside backtick
        const closeIndent = baseIndent;                     // EXACT match with the <div

        // Clean up classes
        const words = inner.split(/\s+/).filter(Boolean);
        let lines = [];
        let currentLine = "";
        
        // Word wrap classes to ~70 characters
        for (const word of words) {
          if (!currentLine) {
            currentLine = word;
          } else if (currentLine.length + word.length + 1 > 70) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine += " " + word;
          }
        }
        if (currentLine) lines.push(currentLine);

        // Add proper spacing to wrapped lines
        const formattedText = lines.map((l, index) => {
          if (index === 0) return l;
          return innerWrapIndent + l;
        }).join("\n");

        // Construct final string perfectly aligned
        let replacement;
        if (words.length === 0) {
          replacement = `className={\n${backtickIndent}\`\`\n${closeIndent}}`;
        } else {
          replacement = `className={\n${backtickIndent}\`${formattedText}\`\n${closeIndent}}`;
        }

        // Apply edit (ignoring Windows \r line endings differences)
        if (fullMatch.replace(/\r\n/g, "\n") !== replacement) {
          const endPos = doc.positionAt(m.index + fullMatch.length);
          edits.push(new vscode.TextEdit(new vscode.Range(startPos, endPos), replacement));
          count++;
        }
      }

      if (edits.length > 0) {
        const wsEdit = new vscode.WorkspaceEdit();
        wsEdit.set(doc.uri, edits);
        await vscode.workspace.applyEdit(wsEdit);
        vscode.window.showInformationMessage(`Formatted ${count} classNames perfectly!`);
      } else {
        vscode.window.showInformationMessage("All classNames are already correctly formatted.");
      }
    }
  );

  // ════════════════════════════════════════════════════════════════════════════
  // 4. STATUS BAR BUTTON
  // ════════════════════════════════════════════════════════════════════════════
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(symbol-string) Format classNames";
  statusBarItem.tooltip = "Format all classNames to Multi-Line Template Literals";
  statusBarItem.command = "classNameTemplateLiteral.formatFile";

  const updateStatusBar = () => {
    const ed = vscode.window.activeTextEditor;
    if (ed && JSX_LANGUAGES.includes(ed.document.languageId)) {
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  };
  updateStatusBar();

  context.subscriptions.push(
    completionProvider,
    documentChangeListener,
    formatCommand,
    statusBarItem,
    vscode.window.onDidChangeActiveTextEditor(updateStatusBar)
  );
}

function deactivate() {}

module.exports = { activate, deactivate };