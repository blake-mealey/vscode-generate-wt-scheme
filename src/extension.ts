import * as vscode from "vscode";
import { parse as parseJson } from "json5";
import { convertThemeToScheme } from "./convertThemeToScheme";

async function promptThemeName() {
  return vscode.window.showInputBox({
    placeHolder: "Theme Name",
  });
}

async function getActiveColorTheme(): Promise<any | undefined> {
  await vscode.commands.executeCommand("workbench.action.generateColorTheme");

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  return parseJson(editor.document.getText());
}

async function replaceEditorText(text: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  return editor.edit((editBuilder) => {
    const firstLine = editor.document.lineAt(0);
    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

    editBuilder.replace(range, text);
  });
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.generate-wt-scheme.generate-scheme",
    async (themeName) => {
      // Prompt the user for a theme name
      themeName = themeName ?? (await promptThemeName());
      if (!themeName) {
        return;
      }

      const theme = await getActiveColorTheme();
      if (!theme) {
        return;
      }

      const scheme = convertThemeToScheme(theme, themeName);
      const schemeText = JSON.stringify(scheme, null, 2);

      const success = await replaceEditorText(schemeText);
      if (success) {
        await vscode.env.clipboard.writeText(schemeText);

        vscode.window.showInformationMessage(
          "The scheme has been generated and copied to your clipboard!"
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
