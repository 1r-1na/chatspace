import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMessages } from "../api/useMessages";
import { FlexBox } from "./Chatspace";
import styled from "styled-components";
import { useOfflineStatus } from "../context/useOfflineStatus";

const Chats = () => {
  const isOffline = useOfflineStatus();
  const [text, setText] = useState<string | undefined>(undefined);

  const [params] = useSearchParams();
  const userName = useMemo(() => params?.get("user"), [params]);
  const conversationId = useMemo(() => params?.get("conversation"), [params]);

  const { messages, sendMessage } = useMessages(conversationId);

  const handleSend = () => {
    if (text && text !== "" && userName) {
      sendMessage({ from: userName, message: text });
      setText("");
    }
  };

  //Todo: separate list for bubbles and input to scroll the messages.
  return (
    <FlexBox
      style={{
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <ChatList>
        {messages.map((m) => (
          <Bubble received={m.from !== userName}>{m.message}</Bubble>
        ))}
      </ChatList>
      {conversationId && (
        <FlexBox style={{ height: "50px" }}>
          <Input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSend();
              }
            }}
          />
          <Button
            type="submit"
            onClick={() => handleSend()}
            disabled={isOffline}
          >
            Ok
          </Button>
        </FlexBox>
      )}
    </FlexBox>
  );
};

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #1384c5;
  border: 2px solid #fe6d00;
  color: ivory;
  border-radius: 4px;
  width: fit-content;
`;

const Input = styled.input`
  border: 2px solid #fe6d00;
  border-radius: 4px;
  width: 100%;
`;

const Bubble = styled.div<{ received?: boolean }>`
  margin-bottom: 1px;
  align-self: ${(props) => (props.received ? "flex-start" : "flex-end")};
  --r: 25px; /* the radius */
  --t: 30px; /* the size of the tail */
  width: fit-content;
  padding: calc(2 * var(--r) / 3);
  -webkit-mask: radial-gradient(var(--t) at var(--_d) 0, #0000 98%, #000 102%)
      var(--_d) 100% / calc(100% - var(--r)) var(--t) no-repeat,
    conic-gradient(at var(--r) var(--r), #000 75%, #0000 0) calc(var(--r) / -2)
      calc(var(--r) / -2) padding-box,
    radial-gradient(50% 50%, #000 98%, #0000 101%) 0 0 / var(--r) var(--r) space
      padding-box;
  background: linear-gradient(135deg, #fe6d00, #1384c5) border-box;
  color: #fff;
  ${(props) =>
    props.received
      ? " --_d: 0%; border-left: var(--t) solid #0000; margin-right: var(--t); place-self: start;"
      : "  --_d: 100%; border-right: var(--t) solid #0000; margin-left: var(--t); place-self: end;"}
`;
export { Chats };
