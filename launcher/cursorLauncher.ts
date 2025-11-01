import { App, Platform, TFile } from "obsidian";
import { spawn } from "child_process";
import { existsSync } from "fs";
import type { PluginSettings } from "../settings";
import { assertDesktopFeature, resolveVaultAbsolutePath, resolveVaultRoot } from "../utils/helpers";
import { pathToFileURL } from "url";
import { buildCursorCommand } from "./testable";

export interface LaunchResult {
  ok: boolean;
  message?: string;
}

export interface CursorPosition {
  line?: number;
  column?: number;
}

const initializedVaults = new Set<string>();

export async function openFileInCursor(app: App, settings: PluginSettings, file: TFile, position?: CursorPosition): Promise<LaunchResult> {
  try {
    assertDesktopFeature(app);
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }

  const filePath = resolveVaultAbsolutePath(app, file);
  if (!filePath) {
    return { ok: false, message: "Unable to resolve absolute path for the active file." };
  }

  const vaultPath = resolveVaultRoot(app);
  const command = resolveCursorExecutable(settings);

  if (settings.cursorExecutablePath && !existsSync(settings.cursorExecutablePath)) {
    console.error("[open-in-ide] Cursor executable missing", settings.cursorExecutablePath);
    return {
      ok: false,
      message: `Cursor executable not found at ${settings.cursorExecutablePath}. Update the setting or clear it to use PATH lookup.`
    };
  }

  if (settings.openVaultBeforeFile && vaultPath && !initializedVaults.has(vaultPath)) {
    const addArgs = buildAddFolderArgs(settings, vaultPath);
    console.log("[open-in-ide] Ensuring vault present in Cursor workspace", {
      command,
      addArgs,
      vaultPath
    });
    try {
      await spawnDetached(command, addArgs);
      initializedVaults.add(vaultPath);
    } catch (error) {
      console.warn("[open-in-ide] Failed to add vault to Cursor workspace", error);
      if (!settings.allowSystemFallback || !isMissingExecutableError(error)) {
        // Continue with main launch even if add fails; fallbacks handled later.
      }
    }
  }

  const { command: handlerCommand, args } = buildCursorCommand({
    command,
    vaultPath,
    filePath,
    line: position?.line,
    column: position?.column,
    reuse: settings.reuseExistingWindow,
    includeVault: Boolean(settings.openVaultBeforeFile && vaultPath)
  });

  console.log("[open-in-ide] Launching Cursor CLI", {
    command: handlerCommand,
    args,
    filePath,
    vaultPath,
    position
  });

  try {
    await spawnDetached(handlerCommand, args);
    const target = args.includes("--goto") ? args[args.length - 1] : filePath;
    return { ok: true, message: `Sent to Cursor (${target}).` };
  } catch (error) {
    if (isMissingExecutableError(error) && settings.allowSystemFallback) {
      const fallback = await launchViaSystem(filePath, vaultPath, settings);
      if (fallback.ok) {
        return fallback;
      }
    }

    return {
      ok: false,
      message: `Failed to launch Cursor: ${(error as Error).message}`
    };
  }
}

function buildGotoTarget(filePath: string, position?: CursorPosition): string | null {
  if (!position || position.line === undefined) {
    return null;
  }

  const line = Math.max(1, position.line);
  const column = position.column !== undefined ? Math.max(1, position.column) : 1;
  const target = `${filePath}:${line}:${column}`;
  return target.includes(" ") ? `"${target}"` : target;
}

function resolveCursorExecutable(settings: PluginSettings): string {
  if (settings.cursorExecutablePath) {
    return settings.cursorExecutablePath;
  }
  return Platform.isWin ? "cursor.exe" : "cursor";
}

function buildAddFolderArgs(settings: PluginSettings, vaultPath: string): string[] {
  const args: string[] = [];
  if (settings.reuseExistingWindow) {
    args.push("--reuse-window");
  }
  args.push("--folder-uri", pathToFileURL(vaultPath).toString());
  return args;
}

async function spawnDetached(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true
    });

    let settled = false;

    const finalize = (error?: Error) => {
      if (settled) return;
      settled = true;
      child.unref();
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };

    child.once("error", (error) => finalize(error));
    child.once("exit", (code) => {
      if (code && code !== 0) {
        finalize(new Error(`${command} exited with code ${code}`));
      } else {
        finalize();
      }
    });
  });
}

function isMissingExecutableError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT");
}

async function launchViaSystem(filePath: string, vaultPath: string | null, settings: PluginSettings): Promise<LaunchResult> {
  try {
    if (Platform.isMacOS) {
      const macArgs = buildMacArgs(filePath, vaultPath, settings);
      console.log("[open-in-ide] macOS fallback", { macArgs });
      await spawnDetached("open", macArgs);
      return { ok: true, message: "Fallback: opened via macOS." };
    }

    if (Platform.isWin) {
      const winArgs = buildWindowsArgs(filePath);
      console.log("[open-in-ide] Windows fallback", { winArgs });
      await spawnDetached("cmd", winArgs);
      return { ok: true, message: "Fallback: opened via Windows shell." };
    }

    await spawnDetached("xdg-open", [filePath]);
    return { ok: true, message: "Fallback: opened via xdg-open." };
  } catch (error) {
    return {
      ok: false,
      message: `Fallback opener failed: ${(error as Error).message}`
    };
  }
}

function buildMacArgs(filePath: string, vaultPath: string | null, settings: PluginSettings): string[] {
  const args: string[] = [];
  args.push("-a", "Cursor");
  if (settings.openVaultBeforeFile && vaultPath) {
    args.push(vaultPath);
  }
  args.push(filePath);
  return args;
}

function buildWindowsArgs(filePath: string): string[] {
  return ["/c", "start", "", '"' + filePath + '"'];
}
