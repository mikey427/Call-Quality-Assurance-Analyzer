import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { Readable } from 'stream';

// TODO:
// Restricting Content-Type: Specify the allowed Content-Type in your SDK's parameters. The signature will include this header, so uploads will fail with a 403/SignatureDoesNotMatch error if the client sends a different Content-Type for an upload request.
// Configuring CORS: If your presigned URLs will be used from a browser, set up CORS rules on your bucket to control which origins can make requests.

const s3 = new S3Client({
	region: "auto", // Required by AWS SDK, not used by R2
	// Provide your R2 endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		// Provide your R2 Access Key ID and Secret Access Key
		accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
	},
});

export async function uploadFile(file: Readable, fileName: string) {
	const uuid = randomUUID();

	const date = Date.now().toString();

	// TODO: Update this to include userId & UUID
	const fileUploadName = `${uuid}_${date}.${fileName.split(".").pop()}`;

	await s3.send(
		new PutObjectCommand({
			Bucket: "atsi-analyzer",
			Key: fileName,
			Body: file
		}),
	);

	return fileUploadName;
}

export async function getPresignedUrl(fileName: string) {
	let url;
	try {
		url = await getSignedUrl(
			s3,
			new GetObjectCommand({ Bucket: "atsi-analyzer", Key: fileName }),
			{ expiresIn: 3600 }, // Valid for 1 hour
		);
	} catch (error) {
		throw error;
	}

	return url;
}

// // Upload a file
// await s3.send(
//   new PutObjectCommand({
//     Bucket: "my-bucket",
//     Key: "myfile.txt",
//     Body: "Hello, R2!",
//   }),
// );
// console.log("Uploaded myfile.txt");

// // Download a file
// const response = await s3.send(
//   new GetObjectCommand({
//     Bucket: "my-bucket",
//     Key: "myfile.txt",
//   }),
// );
// const content = await response.Body.transformToString();
// console.log("Downloaded:", content);

// // List objects
// const list = await s3.send(
//   new ListObjectsV2Command({
//     Bucket: "my-bucket",
//   }),
// );
// console.log(
//   "Objects:",
//   list.Contents.map((obj) => obj.Key),
// );
