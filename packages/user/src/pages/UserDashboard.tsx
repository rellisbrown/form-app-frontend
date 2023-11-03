import React from "react";
import styled from "@emotion/styled";
/* import Button from "@mui/material/Button";
import { Link } from "react-router-dom"; */

const StyledOuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledButtonContainer = styled.div`
  margin: auto;
  display: flex;
  flex-direction: row;
`;

interface Props {}

const UserDashboard: React.FC<Props> = ({}) => {
  return (
    <StyledOuterContainer>
      <StyledButtonContainer>
        {/*  <Link to="../create">
          <Button variant="contained" sx={{ marginRight: "20px" }}>
            Create
          </Button>
        </Link> */}
        User
      </StyledButtonContainer>
    </StyledOuterContainer>
  );
};

export default UserDashboard;
