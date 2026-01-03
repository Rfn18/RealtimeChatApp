import { UserProfile } from "@/app/profile/page";
import { createOrGetChannel, getStreamUserToken } from "@/lib/actions/stream";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function StreamChatInterface({
  otherUser,
}: {
  otherUser: UserProfile;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserID, setCurrentUserId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    async function initializeChat() {
      try {
        setError(null);

        const { token, userId, userName, userImage } =
          await getStreamUserToken();
        setCurrentUserId(userId);

        const chatClient = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY!
        );

        await chatClient.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        const { channelType, channelId } = await createOrGetChannel(
          otherUser.id
        );

        const chatChannel = chatClient.channel(channelType, channelId)
        await chatChannel.watch()

        
      } catch (error) {
        router.push("/chat");
      } finally {
        setLoading(false);
      }
    }

    if (otherUser) {
      initializeChat();
    }
  }, []);
  return <div></div>;
}
