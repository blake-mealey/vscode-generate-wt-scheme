import * as vscode from "vscode";
import { camelCase } from "change-case";
import { parse as parseJson } from "json5";

function convertThemeToScheme(theme: any, name: string) {
  const colors = theme.colors as Record<string, string>;

  const ansiPrefix = "ansi";

  const replacements = Object.entries({
    magenta: "purple",
    brightMagenta: "brightPurple",
  });

  const scheme = {
    name: name,
    background: colors["editor.background"],
    foreground: colors["editor.foreground"],
    cursorColor: colors["editorCursor.foreground"],
    ...Object.fromEntries(
      Object.entries(colors)
        .filter(([key]) => key.startsWith("terminal."))
        .map(([key, value]) => {
          // remove key prefixes
          key = key.split(".")[1];
          if (key.startsWith(ansiPrefix)) {
            key = camelCase(key.substring(ansiPrefix.length));
          }

          // replace keys that have different names
          const replacement = replacements.find(([k]) => k === key);
          if (replacement) {
            key = replacement[1];
          }

          // chop off alpha channel from values
          if (value.match(/#\w{8}/)) {
            value = value.substr(0, 7);
          }

          return [key, value];
        })
    ),
  };

  return scheme;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.generate-wt-scheme.generate-scheme",
    async () => {
      const themeName = await vscode.window.showInputBox({
        placeHolder: "Theme Name",
      });

      if (!themeName) {
        return;
      }

      await vscode.commands.executeCommand(
        "workbench.action.generateColorTheme"
      );

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Get and convert the theme
        const theme = parseJson(editor.document.getText());
        const scheme = convertThemeToScheme(theme, themeName);
        const schemeText = JSON.stringify(scheme, null, 2);

        // Write back to the editor
        await editor.edit((editBuilder) => {
          const firstLine = editor.document.lineAt(0);
          const lastLine = editor.document.lineAt(
            editor.document.lineCount - 1
          );
          const range = new vscode.Range(
            firstLine.range.start,
            lastLine.range.end
          );

          editBuilder.replace(range, schemeText);
        });

        // Write to the clipboard
        await vscode.env.clipboard.writeText(schemeText);

        // Show a message to say the conversion was successful
        await vscode.window.showInformationMessage(
          "The scheme has been generated and copied to your clipboard!"
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
