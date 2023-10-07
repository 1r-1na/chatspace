import { useConversations } from "../api/useConversations";
import { Conversation } from "../api/interfaces";
import { useSearchParams } from "react-router-dom";
import { styled } from "styled-components";
import { useMemo } from "react";

interface ParticipantListProps {
  collapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
}
const ParticipantList = ({ collapsed, onCollapse }: ParticipantListProps) => {
  const [params, setParams] = useSearchParams();
  const conversationId = useMemo(() => params?.get("conversation"), [params]);
  const userName = useMemo(() => params?.get("user"), [params]);

  const conversations = useConversations(userName);

  const onClickConversation = (conversation: Conversation) => {
    params.set("conversation", conversation.id.toString());
    setParams(params);
  };

  return (
    <List>
      {!collapsed &&
        conversations.map((c) => (
          <ListItem
            active={c.id.toString() === conversationId}
            isFirst={c.id === conversations[0].id}
            onClick={() => onClickConversation(c)}
          >
            {c.participants.map((p) => p !== userName && <Box>{p}</Box>)}
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
  isFirst?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  ${(props) => props.isFirst && "border-top: 1px solid ivory;"}
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

export { ParticipantList };
