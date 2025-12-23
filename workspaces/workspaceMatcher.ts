import { existsSync, readFileSync, statSync } from "fs";
import * as path from "path";

export interface WorkspaceFolder {
  name?: string;
  path?: string;
  uri?: string;
}

export interface WorkspaceDefinition {
  folders?: WorkspaceFolder[];
}

export interface WorkspaceMatch {
  workspaceFilePath: string;
  matchedFolderPath: string;
}

type WorkspaceCacheEntry = {
  mtimeMs: number;
  folders: string[];
};

const workspaceCache = new Map<string, WorkspaceCacheEntry>();

function normalizePath(value: string): string {
  return path.resolve(value);
}

function isPathInside(parentPath: string, candidatePath: string): boolean {
  const relative = path.relative(parentPath, candidatePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function loadWorkspaceFolders(workspaceFilePath: string): string[] {
  const stat = statSync(workspaceFilePath);
  const cached = workspaceCache.get(workspaceFilePath);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.folders;
  }

  const raw = readFileSync(workspaceFilePath, "utf8");
  const parsed = JSON.parse(raw) as WorkspaceDefinition;
  const baseDir = path.dirname(workspaceFilePath);

  const folders: string[] = [];
  for (const folder of parsed.folders ?? []) {
    if (!folder.path || typeof folder.path !== "string") {
      continue;
    }

    const resolved = path.isAbsolute(folder.path) ? folder.path : path.join(baseDir, folder.path);
    folders.push(normalizePath(resolved));
  }

  workspaceCache.set(workspaceFilePath, { mtimeMs: stat.mtimeMs, folders });
  return folders;
}

export function findWorkspaceMatchForFile(workspaceFilePath: string, filePath: string): WorkspaceMatch | null {
  if (!workspaceFilePath.trim()) {
    return null;
  }

  if (!existsSync(workspaceFilePath)) {
    return null;
  }

  let folders: string[];
  try {
    folders = loadWorkspaceFolders(workspaceFilePath);
  } catch {
    return null;
  }

  const normalizedFilePath = normalizePath(filePath);

  let bestMatch: string | null = null;
  for (const folderPath of folders) {
    if (!folderPath) continue;
    if (!isPathInside(folderPath, normalizedFilePath)) continue;

    if (!bestMatch || folderPath.length > bestMatch.length) {
      bestMatch = folderPath;
    }
  }

  if (!bestMatch) {
    return null;
  }

  return {
    workspaceFilePath,
    matchedFolderPath: bestMatch
  };
}
