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

export async function createOrGetChannel() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }
}
