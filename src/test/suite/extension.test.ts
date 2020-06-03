import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Generates successfully", async () => {
    const themeName = "test";

    await vscode.commands.executeCommand(
      "extension.generate-wt-scheme.generate-scheme",
      themeName
    );

    const editor = vscode.window.activeTextEditor;
    assert.notStrictEqual(editor, undefined);

    const editorText = editor!.document.getText();

    const scheme = JSON.parse(editorText);
    assert.strictEqual(scheme.name, themeName);

    const clipboardText = await vscode.env.clipboard.readText();
    assert.deepStrictEqual(clipboardText, editorText);
  });
});
