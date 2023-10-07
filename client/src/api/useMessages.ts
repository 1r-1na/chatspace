import { useEffect, useMemo, useState } from "react";
import { Message } from "./interfaces";

interface UseMessagesReturnProps {
  messages: Message[];
  sendMessage: (message: Message) => void;
}

function useMessages(conversationId: string | null): UseMessagesReturnProps {
  const [messages, setMessages] = useState<Message[]>([]);

  const reloadMessages = function () {
    if (conversationId !== null) {
      fetchMessages(conversationId)
        .then((m) => setMessages(m))
        .catch((e) =>
          console.error("An error occurred while reading messages.", e)
        );
    } else if (messages.length > 0) {
      setMessages([]);
    }
  };
  useEffect(() => {
    reloadMessages();
  }, [conversationId]);

  const sendMessage = useMemo(
    () =>
      function (message: Message) {
        if (conversationId !== null) {
          fetchMessagesPost(conversationId, message).catch((e) =>
            console.error("An error occurrd while sending message.", e)
          );
          reloadMessages();
        }
      },
    [conversationId]
  );

  return { messages: messages, sendMessage: sendMessage };
}

async function fetchMessages(conversationId: string) {
  const res = await fetch(
    `http://localhost:5000/conversations/${conversationId}/messages`
  );

  if (!res.ok) {
    throw new Error("Error occurred while reading messages.");
  }
  return res.json();
}

async function fetchMessagesPost(conversationId: string, message: Message) {
  const res = await fetch(
    `http://localhost:5000/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }
  );

  if (!res.ok) {
    throw new Error("Error occurred while sending message.");
  }
  return res.json();
}

export { useMessages };
