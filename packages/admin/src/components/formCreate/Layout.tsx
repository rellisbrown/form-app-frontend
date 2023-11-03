import React, { useContext } from "react";
import styled from "@emotion/styled";
import Control from "./Control";
import HeightIcon from "@mui/icons-material/Height";
import AddMenu from "./AddMenu";
import MoreMenu from "./MoreMenu";
import { CreateFormContext } from "../../context/CreateFormContextProvider";
import { v4 as uuidv4 } from "uuid";
import { getPath, moveItemInArray } from "../../utils/utilFunctions";
import { useConfirm } from "material-ui-confirm";

interface ArrowIconProps {
  orientation?: string;
}

const StyledDoubleArrowIcon = styled(HeightIcon)<ArrowIconProps>`
  margin: auto auto auto 0px;
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

const StyledIconRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledHelperText = styled.p`
  margin: auto auto auto auto;
`;

interface Props {
  UISchemaElement: UISchemaElementCustom;
  parentElements: UISchemaElementCustom[];
}

const Layout: React.FC<Props> = ({ UISchemaElement, parentElements }) => {
  const { schema, uischema, updateSchema } = useContext(CreateFormContext);
  const confirm = useConfirm();

  const path = getPath(uischema, [uischema.elementId], UISchemaElement) || [
    uischema.elementId,
  ];

  const elementIndex = parentElements.findIndex(
    (item) => item.elementId === UISchemaElement.elementId
  );

  const handleAddSelection = (value: string) => {
    let tempSchema = schema;
    let tempUISchema = uischema;
    const uuid = uuidv4();

    let tempElement = tempUISchema;

    if (path)
      for (const [i, v] of path.entries()) {
        if (i !== 0) {
          if (tempElement.elements) {
            let elementIndex = tempElement.elements.findIndex(
              (element) => element.elementId === v
            );

            tempElement = tempElement.elements[elementIndex];
          }
        }
      }

    if (value === "Control") {
      if (tempElement.elements && tempElement.elements.length > 0) {
        tempElement.elements.push({
          elementId: uuid,
          type: "Control",
          scope: `#/properties/${uuid}`,
        });
      } else {
        tempElement.elements = [
          {
            elementId: uuid,
            type: "Control",
            scope: `#/properties/${uuid}`,
          },
        ];
      }
    } else {
      if (tempElement.elements && tempElement.elements.length > 0) {
        tempElement.elements.push({
          elementId: uuid,
          type: value,
        });
      } else {
        tempElement.elements = [
          {
            elementId: uuid,
            type: value,
          },
        ];
      }
    }

    updateSchema(tempSchema, uischema);
  };

  const handleDelete = () => {
    let tempSchema = schema;
    let tempUISchema = uischema;

    let tempElement = tempUISchema;

    if (path)
      for (const [i, v] of path.entries()) {
        if (i !== 0) {
          if (tempElement.elements) {
            // get element list for the current layout element
            if (i === path.length - 1) {
              const controlList = tempElement.elements.find(
                (item) => item.elementId === v
              )?.elements;

              if (controlList && controlList.length > 0) {
                for (const item of controlList) {
                  // remove schema properties for items one layer below too
                  if (item.elements && item.elements.length > 0) {
                    let subControlList = item.elements;
                    for (const item of subControlList) {
                      if (tempSchema.properties) {
                        delete tempSchema.properties[item.elementId];
                      }
                    }
                  }

                  if (tempSchema.properties) {
                    delete tempSchema.properties[item.elementId];
                  }
                }
              }

              tempElement.elements = tempElement.elements.filter(
                (item) => item.elementId !== v
              );
              if (tempElement.elements.length === 0) {
                delete tempElement.elements;
              }

              break;
            } else {
              let elementIndex = tempElement.elements.findIndex(
                (element) => element.elementId === v
              );

              tempElement = tempElement.elements[elementIndex];
            }
          }
        }
      }

    updateSchema(tempSchema, uischema);
  };

  const handleShift = (direction: string) => {
    let tempSchema = schema;
    let tempUISchema = uischema;

    let tempElement = tempUISchema;

    if (path)
      for (const [i, v] of path.entries()) {
        if (i !== 0) {
          if (tempElement.elements) {
            if (i === path.length - 1) {
              let elementIndex = tempElement.elements.findIndex(
                (element) => element.elementId === v
              );
              if (direction === "up") {
                if (elementIndex > 0) {
                  moveItemInArray(
                    tempElement.elements,
                    elementIndex,
                    elementIndex - 1
                  );
                }
              } else {
                if (elementIndex < tempElement.elements.length - 1) {
                  moveItemInArray(
                    tempElement.elements,
                    elementIndex,
                    elementIndex + 1
                  );
                }
              }

              break;
            } else {
              let elementIndex = tempElement.elements.findIndex(
                (element) => element.elementId === v
              );

              tempElement = tempElement.elements[elementIndex];
            }
          }
        }
      }
    updateSchema(tempSchema, uischema);
  };

  const handleMoreSelection = async (value: string) => {
    switch (value) {
      case "delete":
        try {
          await confirm({
            title: "Confirm",
            description: "Are you sure you want to delete this item?",
          });
        } catch (e) {
          break;
        }
        handleDelete();
        break;
      case "up":
        handleShift("up");
        break;
      case "down":
        handleShift("down");
        break;
      default:
        break;
    }
  };

  const getLayoutOrientation = (value: string) => {
    if (value === "HorizontalLayout") {
      return "horizontal";
    }
    return "vertical";
  };

  const getBackgroundColor = (layers: number) => {
    if (layers === 1) {
      return "#f3fbff";
    }
    if (layers === 2) {
      return "#dcf6ff";
    }

    return "#bce8f7";
  };

  return (
    <StyledLayoutContainer backgroundColor={getBackgroundColor(path.length)}>
      <StyledIconRow>
        <StyledDoubleArrowIcon
          orientation={getLayoutOrientation(UISchemaElement.type)}
        />
        {!UISchemaElement.elements && (
          <StyledHelperText>
            Use the + button to create controls or additonal layout elements
          </StyledHelperText>
        )}
        <AddMenu handleSelection={handleAddSelection} />
        <MoreMenu
          handleSelection={handleMoreSelection}
          deleteDisabled={path.length === 1}
          upDisabled={elementIndex === 0 || elementIndex === -1}
          downDisabled={elementIndex === parentElements.length - 1}
        />
      </StyledIconRow>
      {UISchemaElement.elements &&
        UISchemaElement.elements.map((element) => {
          if (element.type === "Control") {
            return (
              <Control
                key={element.elementId}
                UISchemaElement={element}
                parentElements={UISchemaElement.elements || []}
              />
            );
          } else {
            return (
              <Layout
                key={element.elementId}
                UISchemaElement={element}
                parentElements={UISchemaElement.elements || []}
              />
            );
          }
        })}
    </StyledLayoutContainer>
  );
};

export default Layout;
