import React, { useState, useContext } from "react";
import styled from "@emotion/styled";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { CreateFormContext } from "../context/CreateFormContextProvider";
import { Paper, Typography } from "@mui/material";
import { JsonSchema4, JsonSchema7 } from "@jsonforms/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

let theme = createTheme({});

theme = createTheme(theme, {
  components: {
    // Name of the component ⚛️
    MuiFormControl: {
      defaultProps: {
        // The default props to change
        // disableRipple: true, // No more ripple, on the whole application 💣!
        /* color: "primary" */
        sx: {
          /* maxWidth: "80%",
          [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
          }, */
          /* flex: 1, */
          margin: "10px 0 0 0",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        item: ({ ownerState }: any) => {
          const format = ownerState?.children?.props?.uischema?.options?.format;
          console.log(format);
          switch (format) {
            case "select":
              return {
                maxWidth: "50% !important",
              };

            default:
              return {
                maxWidth: "auto",
              };
          }
          /* return {
            maxWidth: "50%",
          }; */
        },
      },
    },
    /*   MuiAutocomplete: {
      styleOverrides: {
        input: {
          width: "auto !important",
        },
      },
    }, */
  },
});

const StyledOuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 100%;
  width: 100%; */
`;

interface Props {}

const FormPreview: React.FC<Props> = ({}) => {
  const [data, setData] = useState(
    {} as { [property: string]: string | undefined }
  );
  const { schema, uischema } = useContext(CreateFormContext);

  let tempSchema = { ...schema };
  let tempProperties:
    | { [property: string]: JsonSchema4 }
    | { [property: string]: JsonSchema7 }
    | undefined = {};

  for (const item in tempSchema.properties) {
    tempProperties[tempSchema.properties[item].title!] =
      tempSchema.properties[item];
  }

  let propertyMap: { [property: string]: string | undefined } = {};

  for (const item in tempSchema.properties) {
    propertyMap[item] = tempSchema.properties[item].title;
  }

  /*   console.log(propertyMap); */

  tempSchema.properties = tempProperties;

  let convertedData: { [property: string]: string | undefined } = {};

  for (const item in data) {
    convertedData[propertyMap[item] as string] = data[item];
  }
  
  console.log("schema", schema);
  console.log("uischema", uischema);
  console.log("converted schema", tempSchema);

  console.log("data", data);
  console.log("converted data", convertedData);

  return (
    <StyledOuterContainer>
      <Paper
        sx={{
          width: "100%",
          padding: "10px 20px 30px 20px",
          margin: "20px auto auto auto",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h5" sx={{ margin: "5px" }}>
          {schema.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ margin: "5px" }}>
          {schema.description}
        </Typography>
        <ThemeProvider theme={theme}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data, errors }) => {
              setData(data);
              if (errors) {
                console.log(errors);
              }
            }}
          />
        </ThemeProvider>
      </Paper>
    </StyledOuterContainer>
  );
};

export default FormPreview;
