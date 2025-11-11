import { pathToFileURL } from "url";

export interface BuildCommandOptions {
  command: string;
  vaultPath: string | null;
  filePath: string;
  line?: number;
  column?: number;
  reuse: boolean;
  includeVault: boolean;
}

export interface CursorCommand {
  command: string;
  args: string[];
}

export function buildCursorCommand(options: BuildCommandOptions): CursorCommand {
  const { command, vaultPath, filePath, line, column, reuse, includeVault } = options;
  const args: string[] = [];

  if (reuse) {
    args.push("--reuse-window");
  }

  if (includeVault && vaultPath) {
    args.push("--folder-uri", pathToFileURL(vaultPath).toString());
  }

  if (line !== undefined) {
    const lineNumber = Math.max(1, line);
    const columnNumber = column !== undefined ? Math.max(1, column) : 1;
    const target = `${filePath}:${lineNumber}:${columnNumber}`;
    args.push("--goto", target.includes(" ") ? `"${target}"` : target);
  } else {
    // Quote file path if it contains spaces (same logic as --goto target)
    args.push(filePath.includes(" ") ? `"${filePath}"` : filePath);
  }

  return {
    command,
    args
  };
}
