import { camelCase } from "change-case";

const ansiPrefix = "ansi";

const replacements: Record<string, string> = {
  magenta: "purple",
  brightMagenta: "brightPurple",
};

const include = [
  "black",
  "blue",
  "cyan",
  "green",
  "purple",
  "red",
  "white",
  "yellow",
  "brightBlack",
  "brightBlue",
  "brightCyan",
  "brightGreen",
  "brightPurple",
  "brightRed",
  "brightWhite",
  "brightYellow",
  "background",
  "foreground",
  "selectionBackground",
  "cursorColor",
];

export function convertThemeToScheme(theme: any, name: string) {
  const colors = theme.colors as Record<string, string>;

  const scheme = {
    name: name,
    background: colors["editor.background"],
    foreground: colors["editor.foreground"],
    cursorColor: colors["editorCursor.foreground"],
    ...Object.fromEntries(
      Object.entries(colors)
        .filter(([key, value]) => key.startsWith("terminal.") && !!value)
        .map(([key, value]) => {
          // remove key prefixes
          key = key.split(".")[1];
          if (key.startsWith(ansiPrefix)) {
            key = camelCase(key.substring(ansiPrefix.length));
          }

          // replace keys that have different names
          const replacement = replacements[key];
          if (replacement) {
            key = replacement;
          }

          // chop off alpha channel from values
          if (value.match(/#\w{8}/)) {
            value = value.substr(0, 7);
          }

          return [key, value];
        })
        .filter(([key]) => include.includes(key))
    ),
  };

  return scheme;
}
