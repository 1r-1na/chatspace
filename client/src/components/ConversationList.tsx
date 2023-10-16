import { useConversations } from "../api/useConversations";
import { Conversation } from "../api/interfaces";
import { useSearchParams } from "react-router-dom";
import { styled } from "styled-components";
import { useEffect, useMemo } from "react";

interface ConversationListProps {
  collapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
}
const ConversationList = ({ collapsed, onCollapse }: ConversationListProps) => {
  const [params, setParams] = useSearchParams();
  const userName = useMemo(() => params?.get("user"), [params]);
  const conversationId = useMemo(() => params?.get("conversation"), [params]);

  const conversations = useConversations(userName);

  const setParamsConversationId = (conId: string) => {
    params.set("conversation", conId);
    setParams(params);
  };

  const onClickConversation = (conversation: Conversation) => {
    setParamsConversationId(conversation.id.toString());
  };

  useEffect(() => {
    if (userName && !conversationId) {
      const conId = localStorage.getItem(userName);
      if (conId) {
        setParamsConversationId(conId);
      }
    }
  }, [userName]);

  useEffect(() => {
    if (userName && conversationId) {
      localStorage.setItem(userName, conversationId);
    }
  }, [userName, conversationId]);

  return (
    <List>
      {!collapsed &&
        conversations.map((c) => (
          <ListItem
            key={c.id}
            active={c.id.toString() === conversationId}
            isfirst={c.id === conversations[0].id}
            onClick={() => onClickConversation(c)}
          >
            {c.participants.map(
              (p) => p !== userName && <Box key={p}>{p}</Box>
            )}
          </ListItem>
        ))}
      <CollapseItem onClick={() => onCollapse(!collapsed)}>
        {collapsed ? ">>" : "<<"}
      </CollapseItem>
    </List>
  );
};

const Box = styled.div`
  padding: 10px 20px;
  background-color: #fe6d00;
  color: ivory;
  border: none;
  border-radius: 4px;
  width: fit-content;
`;

const ListItem = styled.li<{
  active?: boolean;
  isfirst?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  ${(props) => props.isfirst && "border-top: 1px solid ivory;"}
  border-bottom: 1px solid ivory;
  border-left: 1px solid ivory;
  border-right: 1px solid ivory;
  border-radius: 4px;
  pointer: ;
  ${(props) => props.active && "background-color: wheat;"}
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #1384c5;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  &:hover {
    cursor: pointer;
  }
`;

const CollapseItem = styled(Box)`
  visibility: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    visibility: visible;
  }
`;

export { ConversationList as ParticipantList };
