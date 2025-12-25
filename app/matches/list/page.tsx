import { UserProfile } from "@/app/profile/page";
import { useEffect, useState } from "react";

export default function MatchList() {
  const [match, setMatch] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function userMatches() {
      try {
      } catch {}
    }

    userMatches();
  }, []);
  return <div></div>;
}
