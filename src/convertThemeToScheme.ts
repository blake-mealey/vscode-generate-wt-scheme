import { camelCase } from "change-case";

export function convertThemeToScheme(theme: any, name: string) {
  const colors = theme.colors as Record<string, string>;

  const ansiPrefix = "ansi";

  const replacements = Object.entries({
    magenta: "purple",
    brightMagenta: "brightPurple",
  });

  const exclude = ["border"];

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
        .filter(([key]) => !exclude.includes(key))
    ),
  };

  return scheme;
}
