import { describe, expect, it } from "vitest";
import { pathToFileURL } from "url";
import { buildCursorCommand, buildCursorWorkspaceCommand } from "../../launcher/testable";

describe("buildCursorCommand", () => {
  const vault = "/Users/example/Vault";
  const note = "/Users/example/Vault/testing note.md";

  it("builds command with reuse and folder uri", () => {
    const { command, args } = buildCursorCommand({
      command: "cursor",
      vaultPath: vault,
      filePath: note,
      line: 5,
      column: 2,
      reuse: true,
      includeVault: true
    });

    expect(command).toBe("cursor");
    expect(args).toEqual([
      "--reuse-window",
      "--folder-uri",
      pathToFileURL(vault).toString(),
      "--goto",
      `"${note}:5:2"`
    ]);
  });

  it("builds command without vault and cursor location", () => {
    const { args } = buildCursorCommand({
      command: "cursor",
      vaultPath: null,
      filePath: note,
      reuse: false,
      includeVault: false
    });

    expect(args).toEqual([note]);
  });
});

describe("buildCursorWorkspaceCommand", () => {
  it("builds command that opens workspace and targets file", () => {
    const workspaceFile = "/Users/example/Obsidian-Main.code-workspace";
    const note = "/Users/example/Vault/testing note.md";

    const { command, args } = buildCursorWorkspaceCommand({
      command: "cursor",
      workspaceFilePath: workspaceFile,
      filePath: note,
      line: 5,
      column: 2
    });

    expect(command).toBe("cursor");
    expect(args).toEqual([workspaceFile, "--goto", `"${note}:5:2"`]);
  });
});
