import { styled } from "styled-components";
import { Chats } from "./Chats";
import { ParticipantList } from "./ConversationList";
import { UserSelection } from "./UserSelection";
import { useState } from "react";
import { useOfflineStatus } from "../context/useOfflineStatus";
import "./Scroll.css";

const Chatspace = () => {
  const isOffline = useOfflineStatus();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <AppContainer>
      <Grid collapsed={collapsed}>
        <FlexBox style={{ gridColumn: "1 / span 2", gridRow: 1 }}>
          <UserSelection />
        </FlexBox>
        <FlexBox
          style={{
            gridColumn: 1,
            gridRow: 2,
          }}
        >
          <ParticipantList
            collapsed={collapsed}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
          />
        </FlexBox>
        <FlexBox
          style={{
            borderTop: "2px solid ivory",
            borderRadius: "4px",
            gridColumn: 2,
            gridRow: 2,
            overflowY: "scroll",
          }}
        >
          <Chats />
        </FlexBox>
      </Grid>
      {isOffline && (
        <OfflineNotification>You are currently offline!</OfflineNotification>
      )}
    </AppContainer>
  );
};

const Grid = styled.div<{ collapsed?: boolean }>`
  display: grid;
  grid-template-rows: 1fr 8fr;
  grid-template-columns: ${(props) =>
    props.collapsed ? "58.69px 1fr" : "1fr 2fr"};
  box-sizing: border-box;
  grid-gap: 2px;
  border-radius: 4px;
  border: 5px solid #fe6d00;
  height: 90%;
  margin: 20px;
  @media screen and (max-width: 768px) {
    margin: 0px;
    height: 100%;
  }
`;

const FlexBox = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const AppContainer = styled(FlexBox)`
  height: 100vh;
  flex-direction: column;
  background-color: wheat;
`;

const OfflineNotification = styled.div`
  display: flex;
  justify-content: center;
  color: ivory;
  background-color: red;
  padding: 5px;
  position: fixed;
  bottom: 0;
`;

export { Chatspace, FlexBox };
