import { describe, expect, it } from "vitest";
import { resolveLatestCompatibleRelease } from "../src/utils/tools-manager.js";

describe("resolveLatestCompatibleRelease", () => {
	it("falls back to an older fd release when the newest release drops the platform asset", () => {
		const release = resolveLatestCompatibleRelease("fd", "darwin", "x64", [
			{
				tag_name: "v10.4.2",
				assets: [{ name: "fd-v10.4.2-aarch64-apple-darwin.tar.gz" }],
			},
			{
				tag_name: "v10.3.0",
				assets: [{ name: "fd-v10.3.0-x86_64-apple-darwin.tar.gz" }],
			},
		]);

		expect(release).toEqual({
			tagName: "v10.3.0",
			version: "10.3.0",
			assetName: "fd-v10.3.0-x86_64-apple-darwin.tar.gz",
		});
	});

	it("supports repos whose tags do not start with v", () => {
		const release = resolveLatestCompatibleRelease("rg", "darwin", "x64", [
			{
				tag_name: "15.1.0",
				assets: [{ name: "ripgrep-15.1.0-x86_64-apple-darwin.tar.gz" }],
			},
		]);

		expect(release).toEqual({
			tagName: "15.1.0",
			version: "15.1.0",
			assetName: "ripgrep-15.1.0-x86_64-apple-darwin.tar.gz",
		});
	});

	it("throws a clear error when no compatible assets exist in recent releases", () => {
		expect(() =>
			resolveLatestCompatibleRelease("fd", "darwin", "x64", [
				{
					tag_name: "v10.4.2",
					assets: [{ name: "fd-v10.4.2-aarch64-apple-darwin.tar.gz" }],
				},
			]),
		).toThrow(
			"No compatible release asset found for fd on darwin/x64 (expected fd-v10.4.2-x86_64-apple-darwin.tar.gz)",
		);
	});
});
