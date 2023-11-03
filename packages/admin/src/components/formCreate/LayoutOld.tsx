/* import React, { useContext } from "react";
import styled from "@emotion/styled";
import Control from "./Control";
import HeightIcon from "@mui/icons-material/Height";
import AddMenu from "./AddMenu";
import { CreateFormContext } from "../../context/CreateFormContextProvider";
import { v4 as uuidv4 } from "uuid";

interface ArrowIconProps {
  orientation?: string;
}

const StyledDoubleArrowIcon = styled(HeightIcon)<ArrowIconProps>`
  transform: ${(props) =>
    `rotate(${props.orientation === "vertical" ? 0 : 90}deg)`};
`;

interface LayoutContainerProps {
  backgroundColor: string;
}

const StyledLayoutContainer = styled.div<LayoutContainerProps>`
  margin-top: 10px;
  width: 100%;
  border: 2px solid grey;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background-color: ${(props) => props.backgroundColor};
`;

interface Props {
  UISchemaElement: UISchemaElementCustom;
}

const Layout: React.FC<Props> = ({ UISchemaElement }) => {
  const { schema, uischema, updateSchema } = useContext(CreateFormContext);

  const getPath = (schemaElement: UISchemaElementCustom, path: string[]) => {
    console.log("path", path);
    let tempPath = [...path];
    tempPath.push(schemaElement.elementId);
    if (schemaElement.elementId === UISchemaElement.elementId) {
      console.log("early");
      return tempPath;
    }
    if (schemaElement.elements) {
      for (const element of schemaElement.elements) {
        if (element.elementId === UISchemaElement.elementId) {
          console.log(tempPath, element);
          tempPath.push(element.elementId);
          console.log(tempPath);
          console.log("array");
          return tempPath;
        } else {
          console.log("recursive", element);
          getPath(element, [...tempPath, element.elementId]);
        }
      }
    }
  };

  const handleSelection = (value: string) => {
    const path = getPath(uischema, []);
    console.log("result", path, uischema);
    let tempSchema = schema;
    let tempUISchema = uischema;
    const uuid = uuidv4();

    
    if (value === "Control") {
      if (UISchemaElement.layer === 0) {
        if (tempUISchema.elements && tempUISchema.elements.length > 0) {
          tempUISchema.elements.push({
            elementId: uuid,
            type: "Control",
            scope: `#/properties/${uuid}`,
            layer: UISchemaElement.layer + 1,
            elementIndex: tempUISchema.elements.length,
          });
        } else {
          tempUISchema.elements = [
            {
              elementId: uuid,
              type: "Control",
              scope: `#/properties/${uuid}`,
              layer: UISchemaElement.layer + 1,
              elementIndex: 0,
            },
          ];
        }
      } else if (UISchemaElement.layer === 1) {
        let nestedLayoutElement =
          tempUISchema.elements?.[UISchemaElement.elementIndex];
        if (
          nestedLayoutElement &&
          nestedLayoutElement.elements &&
          nestedLayoutElement.elements.length > 0
        ) {
          nestedLayoutElement.elements.push({
            elementId: uuid,
            type: "Control",
            scope: `#/properties/${uuid}`,
            layer: nestedLayoutElement.layer + 1,
            elementIndex: nestedLayoutElement.elements.length,
          });
        } else if (nestedLayoutElement) {
          nestedLayoutElement.elements = [
            {
              elementId: uuid,
              type: "Control",
              scope: `#/properties/${uuid}`,
              layer: nestedLayoutElement.layer + 1,
              elementIndex: 0,
            },
          ];
        }
      }
    } else {
      if (UISchemaElement.layer === 0) {
        if (tempUISchema.elements && tempUISchema.elements.length > 0) {
          tempUISchema.elements.push({
            elementId: uuid,
            type: value,

            layer: UISchemaElement.layer + 1,
            elementIndex: tempUISchema.elements.length,
          });
        } else {
          tempUISchema.elements = [
            {
              elementId: uuid,
              type: value,
              layer: UISchemaElement.layer + 1,
              elementIndex: 0,
            },
          ];
        }
      } else if (UISchemaElement.layer === 1) {
        let nestedLayoutElement =
          tempUISchema.elements?.[UISchemaElement.elementIndex];
        if (
          nestedLayoutElement &&
          nestedLayoutElement.elements &&
          nestedLayoutElement.elements.length > 0
        ) {
          nestedLayoutElement.elements.push({
            elementId: uuid,
            type: value,
            layer: nestedLayoutElement.layer + 1,
            elementIndex: nestedLayoutElement.elements.length,
          });
        } else if (nestedLayoutElement) {
          nestedLayoutElement.elements = [
            {
              elementId: uuid,
              type: value,
              layer: nestedLayoutElement.layer + 1,
              elementIndex: 0,
            },
          ];
        }
      }
    }
    updateSchema(tempSchema, uischema);
  };

  const getLayoutOrientation = (value: string) => {
    if (value === "HorizontalLayout") {
      return "horizontal";
    }
    return "vertical";
  };

  const getBackgroundColor = (layer: number) => {
    if (layer === 0) {
      return "#f3fbff";
    }
    return "#dcf6ff";
  };

  return (
    <StyledLayoutContainer
      backgroundColor={getBackgroundColor(UISchemaElement.layer)}
    >
      <StyledDoubleArrowIcon
        orientation={getLayoutOrientation(UISchemaElement.type)}
      />
      {UISchemaElement.elements &&
        UISchemaElement.elements.map((element) => {
          if (element.type === "Control") {
            return (
              <Control key={element.elementIndex} UISchemaElement={element} />
            );
          } else {
            return (
              <Layout key={element.elementIndex} UISchemaElement={element} />
            );
          }
        })}
      <AddMenu handleSelection={handleSelection} />
    </StyledLayoutContainer>
  );
};

export default Layout;
 */