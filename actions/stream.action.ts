"use server";
import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY!;

// 👇🏻 -- For Stream Chat  --
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export async function createToken(
	userId: string,
): Promise<string> {
	if (!userId) throw new Error("User is not authenticated");
	return serverClient.createToken(userId);
}

export async function createChannel({
	therapist,
    clientName,
    clientId
}: {
	therapist: TherapistData,
        clientName: string;
    clientId: string;
}) {
	try {
		//check if channel already exists
		const filter = {
			type: "messaging",
			members: { $in: [therapist.id, clientId] },
		};
		const sort = [{ last_message_at: -1 }];

		const channels = await serverClient.queryChannels(filter, sort, {
			watch: true,
			state: true,
		});
		if (channels.length > 0) {
			return { success: true, error: null, id: channels[0].id };
		}

		const channel = serverClient.channel(
			"messaging",
			`therapist-${clientId}`,
			{
				name: `${clientName} with ${therapist.name}`,
				members: [therapist.id, clientId],
				created_by_id: therapist.id,
			}
		);
		await channel.create();
		return { success: true, error: null, id: channel.id };
	} catch (err) {
		console.log("Error creating channel:", err);
		return { success: false, error: "Failed to create channel", id: null };
	}
}

// 👇🏻 -- For Stream Video  --
export const tokenProvider = async (user_id: string) => {
	if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
	if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

	const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

	const expirationTime = Math.floor(Date.now() / 1000) + 3600;
	const issuedAt = Math.floor(Date.now() / 1000) - 60;

	const token = streamClient.generateUserToken({
		user_id,
		exp: expirationTime,
		validity_in_seconds: issuedAt,
	});

	return token;
};