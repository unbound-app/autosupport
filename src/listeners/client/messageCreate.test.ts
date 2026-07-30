import { describe, expect, test } from "bun:test";
import { hasIgnoredRole } from "@src/listeners/client/messageCreate";

describe("hasIgnoredRole", () => {
	test("returns true when the member has an ignored role", () => {
		expect(hasIgnoredRole(["member", "ignored"], ["ignored"])).toBe(true);
	});

	test("returns false when the member has no ignored roles", () => {
		expect(hasIgnoredRole(["member"], ["ignored"])).toBe(false);
	});
});
