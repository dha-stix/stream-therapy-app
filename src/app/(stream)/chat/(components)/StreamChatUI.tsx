"use client";
import {
	Chat,
	Channel,
	ChannelList,
	Window,
	ChannelHeader,
	MessageList,
	MessageInput,
} from "stream-chat-react";
import { useGetStreamClient } from "@/app/(stream)/hooks/useGetStreamClient";
import ChatNav from "./ChatNav";

export default function StreamChatUI({
	user,
	members,
}: {
	user: ClientData | TherapistData;
	members: Member;
}) {
	const { client } = useGetStreamClient(user!);

	const filters = { members: { $in: [user.id] }, type: "messaging" };
	const options = { presence: true, state: true };

	if (!client) return <div>Loading...</div>;

	return (
		<div className='W-full min-h-screen'>
			<ChatNav user={user} members={members} />
			<Chat client={client}>
				<div className='chat-container'>
					{/* -- Channel List -- */}
					<div className='channel-list'>
						<ChannelList
							sort={{ last_message_at: -1 }}
							filters={filters}
							options={options}
						/>
					</div>

					{/* -- Messages Panel -- */}
					<div className='chat-panel'>
						<Channel>
							<Window>
								<ChannelHeader />
								<MessageList />
								<MessageInput />
							</Window>
						</Channel>
					</div>
				</div>
			</Chat>
		</div>
	);
}