import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// hathora login

import { loginCommand } from "./commands/login";

// hathora list deployments --appId 123

import { appCreateCommand } from "./commands/app/create";

// hathora deploy --appId 123 --file ./test.zip

import { deployCommand } from "./commands/deploy";

import { roomCommand } from "./commands/room";

import { logAllCommand } from "./commands/log";
import { processesCommand } from "./commands/processes";
import { deploymentsCommand } from "./commands/deployments";
import { buildCommand } from "./commands/build";

yargs(hideBin(process.argv))
	.scriptName("hathora")
	.demandCommand()
	.recommendCommands()
	.completion()
	.usage("Usage: $0 <command> [options]")
	.command(loginCommand)
	.command(appCreateCommand)
	.command(deployCommand)
	.command(logAllCommand)
	.command(processesCommand)
	.command(deploymentsCommand)
	.command(buildCommand)
	.command(roomCommand)
	.help()
	.parse();
