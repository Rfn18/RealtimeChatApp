"use client";

import { UserProfile } from "@/app/profile/page";
import { getUserMatches } from "@/lib/actions/matches";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatConversationPage() {
  const params = useParams;
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);

  const userId = params.userId as string;

  useEffect(() => {
    async function loadMatches() {
      try {
        const userMatches = await getUserMatches();
        const matchedUser = userMatches.find((match) => match.id === userId);
        setOtherUser(matchedUser);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  return <div></div>;
}
