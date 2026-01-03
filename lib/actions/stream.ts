import { StreamChat } from "stream-chat";
import { createClient } from "../supabase/server";

export async function getStreamUserToken() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const { data: UserData, error: UserError } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (UserError) {
    console.log("Error fetching user data:", UserError);
    throw new Error("Failed to fetch user data");
  }

  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.NEXT_STREAM_SECRET!
  );

  const token = serverClient.createToken(user.id);

  await serverClient.upsertUser({
    id: user.id,
    name: UserData.full_name,
    image: UserData.avatar_url || undefined,
  });

  return {
    token,
    userId: user.id,
    userName: UserData.full_name,
    userImage: UserData.avatar_url,
  };
}

export async function createOrGetChannel(otherUserId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .or(
      `and(user1_id.eq.${user.id}, user2_id.eq.${otherUserId}), and(user1_id.eq.${otherUserId}, user2_id.eq.${user.id})`
    )
    .eq("is_active", true)
    .single();

  if (matchError || !matches) {
    throw new Error("User not matched. cannot create chat channel");
  }

  const sortedIds = [user.id, otherUserId].sort();
  const combinedIds = sortedIds.join("_");

  const channelId = `match_${combinedIds}`;

  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.NEXT_STREAM_SECRET!
  );

  const { data: otherUserData, error: otherUserError } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .eq("id", otherUserId)
    .single();

  if (otherUserError) {
    console.log("Error fetching user data:", otherUserError);
    throw new Error("Failed to fetch user data");
  }

  const channel = serverClient.channel("messaging", channelId, {
    members: [user.id, otherUserId],
    created_by_id: user.id,
  });

  await serverClient.upsertUser({
    id: otherUserId,
    name: otherUserData.full_name,
    image: otherUserData.avatar_url || undefined,
  });

  try {
    await channel.create();
    console.log("Channel created successfully", channelId);
  } catch (error) {
    console.log("Channel creation error", error);

    if (error instanceof Error && !error.message.includes("already exist")) {
      throw error
    }
  }
  
  return {
    channelType: "messaging",
    channelId
  }
}
