import { Listener } from "@sapphire/framework";
import { config } from "@src/config";
import { getGuildSettingsIfExists } from "@src/database/db";
import { getResponse } from "@utils/autosupport";
import type { Message } from "discord.js";

function hasIgnoredRole(
	memberRoleIds: Iterable<string>,
	ignoredRoleIds: readonly string[],
): boolean {
	const ignoredRoles = new Set(ignoredRoleIds);
	for (const roleId of memberRoleIds) {
		if (ignoredRoles.has(roleId)) return true;
	}
	return false;
}

export class MessageListener extends Listener {
	public async run(message: Message) {
		if (!message.inGuild() || message.author.bot) return;
		if (!message.channel.isThread()) return;
		const settings = await getGuildSettingsIfExists(message.guildId);
		if (!config.devGuildId && message.channel.parentId) {
			if (!settings?.channelIds.includes(message.channel.parentId)) return;
		}
		const member =
			message.member ??
			(await message.guild.members.fetch(message.author.id).catch(() => null));
		if (
			hasIgnoredRole(
				member?.roles.cache.keys() ?? [],
				settings?.ignoredRoleIds ?? [],
			)
		)
			return;
		await getResponse(message);
	}
}
