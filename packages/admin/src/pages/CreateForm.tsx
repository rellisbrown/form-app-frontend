import React, { useState } from "react";
import styled from "@emotion/styled";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormCreate from "../components/formCreate/FormCreate";
import FormPreview from "../components/FormPreview";
import { CreateFormContextProvider } from "../context/CreateFormContextProvider";

const StyledOuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledInnerContainer = styled.div`
  width: 80%;
  height: 80vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  max-width: 800px;
`;

const StyledTabs = styled(Tabs)``;

const StyledTab = styled(Tab)``;

interface Props {}

const CreateForm: React.FC<Props> = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  /*  const schema: Schema = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 1,
      },
      description: {
        title: "Long Description",
        type: "string",
      },
      done: {
        type: "boolean",
      },
      due_date: {
        type: "string",
        format: "date",
      },
      rating: {
        type: "integer",
        maximum: 5,
      },
      recurrence: {
        type: "string",
        enum: ["Never", "Daily", "Weekly", "Monthly"],
      },
      recurrence_interval: {
        type: "integer",
      },
    },
    required: ["name", "due_date"],
  }; */

  /*  const uischema: UISchema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        label: "Completed",
        scope: "#/properties/done",
      },
      {
        type: "Control",
        scope: "#/properties/name",
      },
      {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/due_date",
          },
          {
            type: "Control",
            scope: "#/properties/rating",
          },
        ],
      },
      {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/recurrence",
          },
          {
            type: "Control",
            scope: "#/properties/recurrence_interval",
          },
        ],
      },
      {
        type: "Control",
        scope: "#/properties/description",
        options: {
          multi: true,
        },
      },
    ],
  }; */

  const getTabContent = () => {
    switch (tabValue) {
      case 0:
        return <FormCreate />;
      case 1:
        return <FormPreview />;
      default:
        return <FormCreate />;
    }
  };

  return (
    <StyledOuterContainer>
      <StyledInnerContainer>
        <StyledTabs value={tabValue} onChange={handleChange}>
          <StyledTab label="Schema" disableRipple />
          <StyledTab label="Preview" disableRipple />
        </StyledTabs>
        <CreateFormContextProvider>{getTabContent()}</CreateFormContextProvider>
      </StyledInnerContainer>
    </StyledOuterContainer>
  );
};

export default CreateForm;
