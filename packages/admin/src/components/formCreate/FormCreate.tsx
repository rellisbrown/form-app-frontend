import React, { useContext } from "react";
import styled from "@emotion/styled";
import Layout from "./Layout";
import { CreateFormContext } from "../../context/CreateFormContextProvider";
import TextField from "@mui/material/TextField";

const StyledOuterContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const StyledContentContainer = styled.div`
  margin: 20px auto auto auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

interface Props {}

const FormCreate: React.FC<Props> = ({}) => {
  const { uischema, schema, updateSchema } = useContext(CreateFormContext);

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let tempSchema = schema;
    tempSchema.title = event.target.value;

    updateSchema(tempSchema, uischema);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let tempSchema = schema;
    tempSchema.description = event.target.value;

    updateSchema(tempSchema, uischema);
  };

  return (
    <StyledOuterContainer>
      <StyledContentContainer>
        <TextField
          id="standard-basic"
          label="Title"
          variant="outlined"
          sx={{ mt: 1, mb: 1, flex: 1 }}
          value={schema.title || ""}
          onChange={handleTitleChange}
        />
        <TextField
          id="standard-basic"
          label="Description"
          variant="outlined"
          sx={{ mt: 1, mb: 1, flex: 1 }}
          value={schema.description || ""}
          onChange={handleDescriptionChange}
        />
        {/* Initial layout takes in whole ui schema as "element" */}
        <Layout
          key={uischema.elementId}
          UISchemaElement={uischema}
          parentElements={[]}
        />
      </StyledContentContainer>
    </StyledOuterContainer>
  );
};

export default FormCreate;
