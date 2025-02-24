import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { createTar } from "../../util/createTar";

export const createBuildCommand: CommandModule<
	{},
	{
		appId: string;
		file: string;
		token: string;
	}
> = {
	command: "create",
	describe: "create a build",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		file: {
			type: "string",
			describe: "path to the tgz archive to deploy",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		const client = getApiClient(args.token);
		try {
			if (args.file && !(await stat(args.file)).isFile()) {
				return ERROR_MESSAGES.FILE_NOT_FOUND(args.file);
			}

			const fileContents =
				args.file === undefined
					? await createTar()
					: createReadStream(args.file);

			const createResponse = await client.createBuild({
				appId: args.appId,
			});
			const buildResponse = await client.runBuildRaw({
				appId: args.appId,
				buildId: createResponse.buildId,
				// @ts-expect-error
				file: fileContents, // readable stream works with the form-data package but the generated sdk wants a blob.
			});
			let body = buildResponse.raw.body!;
			body["pipe"](process.stdout);
			await buildResponse.value();
		} catch (e) {
			if (e instanceof ResponseError) {
				ERROR_MESSAGES.RESPONSE_ERROR(
					e.response.status.toString(),
					e.response.statusText
				);
			}
			throw e;
		}
	},
};
