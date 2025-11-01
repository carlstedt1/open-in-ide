import { App, FileSystemAdapter, Platform, TFile } from "obsidian";
import { fileURLToPath } from "url";

export function isRunningOnDesktop(): boolean {
  return Platform.isDesktopApp;
}

export function resolveVaultAbsolutePath(app: App, file: TFile): string | null {
  const adapter = app.vault.adapter;
  if (!(adapter instanceof FileSystemAdapter)) {
    return null;
  }

  return sanitizeAbsolutePath(adapter.getFilePath(file.path));
}

export function resolveVaultRoot(app: App): string | null {
  const adapter = app.vault.adapter;
  if (!(adapter instanceof FileSystemAdapter)) {
    return null;
  }

  const root = app.vault.getRoot();
  const rootPath = root.path === "/" ? "" : root.path;
  const absolute = rootPath ? adapter.getFilePath(rootPath) : adapter.getBasePath();
  return sanitizeAbsolutePath(absolute);
}

function sanitizeAbsolutePath(value: string): string {
  if (value.startsWith("file://")) {
    try {
      return fileURLToPath(value);
    } catch (error) {
      console.warn("[open-in-ide] Failed to convert file URL to path", value, error);
    }
  }
  return value;
}

export function assertDesktopFeature(app: App): void {
  if (!isRunningOnDesktop()) {
    throw new Error("This feature is available on desktop Obsidian only.");
  }

  const adapter = app.vault.adapter;
  if (!(adapter instanceof FileSystemAdapter)) {
    throw new Error("Cannot resolve absolute paths without the desktop file system adapter.");
  }
}
