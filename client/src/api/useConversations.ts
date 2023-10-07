import { useEffect, useState } from "react";
import { Conversation } from "./interfaces";

function useConversations(userName: string | null): Conversation[] {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (userName !== null) {
      fetchConversations(userName)
        .then((c) => setConversations(c))
        .catch((e) =>
          console.error("An error occurred while reading conversations.", e)
        );
    } else if (conversations.length > 0) {
      setConversations([]);
    }
  }, [userName]);

  return conversations;
}

async function fetchConversations(user: string): Promise<Conversation[]> {
  const res = await fetch(
    "http://localhost:5000/conversations?" + new URLSearchParams({ user: user })
  );

  if (!res.ok) {
    throw new Error("Error occurred while reading conversations.");
  }
  return res.json();
}

export { useConversations };
