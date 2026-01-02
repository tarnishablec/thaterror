import { describe, expect, test } from "bun:test";
import { That } from "@thaterror/core";

describe("ThatError Caller Tracing", () => {

    test("stack trace should start from business code, not factory", () => {
        const AppError = That({TEST: "msg"});
        const err = AppError.TEST();

        const stack = err.stack ?? "";
        const lines = stack.split("\n");

        const topFrame = lines[1] ?? "";

        const pathSegments = new URL(import.meta.url).pathname.split('/');
        const currentFileName = pathSegments.at(-1) ?? "";

        expect(topFrame).toContain(currentFileName);

        expect(topFrame).not.toContain("define.ts");

        expect(topFrame.length).toBeGreaterThan(0);
    });
});