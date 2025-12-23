import { describe, expect, it } from "vitest";
import * as path from "path";

import { findWorkspaceMatchForFile } from "../../workspaces/workspaceMatcher";

describe("findWorkspaceMatchForFile", () => {
  const workspaceFilePath = path.join(__dirname, "..", "fixtures", "obsidian-main.code-workspace");
  const fixtureRoot = path.resolve(path.dirname(workspaceFilePath));

  it("matches when file is under a workspace folder", () => {
    const filePath = path.join(fixtureRoot, "VaultRoot", "Note.md");
    const match = findWorkspaceMatchForFile(workspaceFilePath, filePath);

    expect(match).not.toBeNull();
    expect(match?.workspaceFilePath).toBe(workspaceFilePath);
    expect(match?.matchedFolderPath.endsWith(path.join("VaultRoot"))).toBe(true);
  });

  it("picks the most specific folder match", () => {
    const filePath = path.join(fixtureRoot, "VaultRoot", ".obsidian", "python_scripts", "tool.py");
    const match = findWorkspaceMatchForFile(workspaceFilePath, filePath);

    expect(match).not.toBeNull();
    expect(match?.matchedFolderPath.endsWith(path.join("VaultRoot", ".obsidian", "python_scripts"))).toBe(true);
  });

  it("returns null when workspace does not include the file", () => {
    const filePath = path.join(fixtureRoot, "Other", "Note.md");
    const match = findWorkspaceMatchForFile(workspaceFilePath, filePath);
    expect(match).toBeNull();
  });
});
