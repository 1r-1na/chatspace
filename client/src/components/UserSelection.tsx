import styled from "styled-components";
import { useUsers } from "../api/useUsers";
import { FlexBox } from "./Chatspace";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const UserSelection = () => {
  const users = useUsers();
  const [params, setParams] = useSearchParams();
  const selectedUsername = useMemo(() => params.get("user"), [params]);

  const currentUser = useMemo(
    () => users.find((u) => u.username === selectedUsername) ?? null,
    [selectedUsername, users]
  );

  return (
    <FlexBox>
      <Container>
        {currentUser && <Image src={currentUser.image} />}
        <Select
          value={selectedUsername ?? undefined}
          onChange={(event) => {
            setParams(new URLSearchParams({ user: event.target.value }));
          }}
        >
          <option disabled selected value={undefined}>
            -- select a user --
          </option>
          {users.map((u) => (
            <option key={u.username} value={u.username}>
              {u.fullname}
            </option>
          ))}
        </Select>
      </Container>
    </FlexBox>
  );
};

const Image = styled.img`
  border-radius: 50%;
  margin-top: 1px;
  margin-left: 1px;
  margin-bottom: 1px;
`;

const Select = styled.select`
  align-items: center;
  text-align: center;
  cursor: pointer;
  background-color: #1384c5;
  color: ivory;
  outline: none;
  border: none;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  width: 300px;
  height: 80px;
  justify-content: space-between;
  border: 2px solid #fe6d00;
  border-radius: 4px;
  background-color: #1384c5;
  @media screen and (max-width: 768px) {
    height: 60px;
    width: 100%;
  }
`;

export { UserSelection };
