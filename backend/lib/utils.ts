import { clean } from "better-auth/client";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export async function loadInstructionsFromFiles() {
	const files = await readdir(join(__dirname, "../instructions"));

	// console.log("Files: ", files);

	let instructionSet = {
		main: "",
		node1: "",
		node2: "",
		node3: "",
		node4: "",
		node5: "",
		node6: "",
		node7: "",
	};

	await Promise.all(
		files.map(async (fileName) => {
			let cleanName = fileName.replaceAll("_", "");
			cleanName = cleanName.split(".")[0];

			if (Object.hasOwn(instructionSet, cleanName)) {
				instructionSet[cleanName as keyof typeof instructionSet] =
					await readFile(
						join(__dirname, "../instructions/" + fileName),
						"utf-8",
					);
			}
		}),
	);
	
	if(Object.values(instructionSet).some(val => val === null || val === undefined || val === "")) {
		throw new Error("Error loading instructions")
	}

	return instructionSet
}

