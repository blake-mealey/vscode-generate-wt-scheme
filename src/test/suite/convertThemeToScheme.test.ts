import * as assert from "assert";
import { convertThemeToScheme } from "../../convertThemeToScheme";

suite("Convert", () => {
  test("Converts theme correctly", () => {
    const theme = {
      $schema: "vscode://schemas/color-theme",
      type: "dark",
      colors: {
        "editor.background": "#011627",
        "editor.foreground": "#d6deeb",
        "editorCursor.foreground": "#80a4c2",
        "terminal.ansiBlack": "#011627",
        "terminal.ansiBlue": "#82aaff",
        "terminal.ansiBrightBlack": "#575656",
        "terminal.ansiBrightBlue": "#82aaff",
        "terminal.ansiBrightCyan": "#7fdbca",
        "terminal.ansiBrightGreen": "#22da6e",
        "terminal.ansiBrightMagenta": "#c792ea",
        "terminal.ansiBrightRed": "#ef5350",
        "terminal.ansiBrightWhite": "#ffffff",
        "terminal.ansiBrightYellow": "#ffeb95",
        "terminal.ansiCyan": "#21c7a8",
        "terminal.ansiGreen": "#22da6e",
        "terminal.ansiMagenta": "#c792ea",
        "terminal.ansiRed": "#ef5350",
        "terminal.ansiWhite": "#ffffff",
        "terminal.ansiYellow": "#addb67",
        "terminal.selectionBackground": "#1b90dd4d",
        "terminal.foreground": "#cccccc", // should use the terminal foreground if available
        "terminal.background": null, // should ignore the terminal background if its value is null
        "terminalCursor.background": "#234d70",
      },
    };

    const name = "test";
    const scheme = convertThemeToScheme(theme, name);

    assert.deepStrictEqual(scheme, {
      name,
      background: "#011627",
      foreground: "#cccccc",
      cursorColor: "#80a4c2",
      black: "#011627",
      blue: "#82aaff",
      brightBlack: "#575656",
      brightBlue: "#82aaff",
      brightCyan: "#7fdbca",
      brightGreen: "#22da6e",
      brightPurple: "#c792ea",
      brightRed: "#ef5350",
      brightWhite: "#ffffff",
      brightYellow: "#ffeb95",
      cyan: "#21c7a8",
      green: "#22da6e",
      purple: "#c792ea",
      red: "#ef5350",
      white: "#ffffff",
      yellow: "#addb67",
      selectionBackground: "#1b90dd",
    });
  });
});
