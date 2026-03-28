import { readFile } from "node:fs";


type FileName = string


export async function loadInstructionsFromFiles([]: FileName[]) {

	readFile("../instructions", (err, data) => {
		
	} );

}