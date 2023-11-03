import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Fade } from "@mui/material";
import { CreateFormContext } from "../../context/CreateFormContextProvider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { getPath, moveItemInArray } from "../../utils/utilFunctions";
import { JsonSchema4, JsonSchema7 } from "@jsonforms/core";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import IconButton from "@mui/material/IconButton";
import { useConfirm } from "material-ui-confirm";
import useMediaQuery from "@mui/material/useMediaQuery";

const StyledControlContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  border: 2px dashed #0000004a;
  display: flex;
  flex-direction: row;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
`;

const StyledRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInputRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

interface Props {
  UISchemaElement: UISchemaElementCustom;
  parentElements: UISchemaElementCustom[];
}

interface ControlProperties {
  title: string;
  type: string | string[];
  [key: string]: string | number | string[];
}

interface DateFormatProperties {
  format: string;
  dateFormat: string;
  dateSaveFormat: string;
  timeFormat: string;
  timeSaveFormat: string;
  dateTimeFormat: string;
  dateTimeSaveFormat: string;
  views?: string[];
}

interface ListFormatProperties {
  format: string;
}

const Control: React.FC<Props> = ({ UISchemaElement, parentElements }) => {
  const confirm = useConfirm();
  const { schema, uischema, updateSchema } = useContext(CreateFormContext);
  let schemaElement: JsonSchema4 | JsonSchema7 = {};
  if (schema.properties) {
    schemaElement = schema.properties[UISchemaElement.elementId];
  }

  const convertType = (value: string) => {
    switch (value) {
      case "string":
        if (UISchemaElement.options) {
          if (
            UISchemaElement.options.format === "date" ||
            UISchemaElement.options.format === "time" ||
            UISchemaElement.options.format === "date-time"
          ) {
            return "Date";
          }
          if (
            UISchemaElement.options.format === "select" ||
            UISchemaElement.options.format === "radio" ||
            UISchemaElement.options.format === "date-time"
          ) {
            return "List";
          }
        }
        return "Text";
      case "number":
        return "Number";
      case "integer":
        return "Integer";
      case "boolean":
        return "Checkbox";

      default:
        return "Text";
    }
  };

  const getInitialControlProperties = () => {
    let tempControlProperties: ControlProperties = {
      title: "",
      type: "",
    };
    if (schemaElement) {
      if (schemaElement.title) {
        tempControlProperties.title = schemaElement.title;
      }
      if (schemaElement.type) {
        tempControlProperties.type = convertType(schemaElement.type as string);
      }
      if (schemaElement.enum) {
        tempControlProperties.enum = schemaElement.enum;
      }
      if (schemaElement.maximum) {
        tempControlProperties.maximum = schemaElement.maximum;
      }
      if (schemaElement.minimum) {
        tempControlProperties.minimum = schemaElement.minimum;
      }
      if (schemaElement.maxLength) {
        tempControlProperties.maxLength = schemaElement.maxLength;
      }
      if (schemaElement.minLength) {
        tempControlProperties.minLength = schemaElement.minLength;
      }
      if (schemaElement.pattern) {
        tempControlProperties.pattern = schemaElement.pattern;
      }
    }
    return tempControlProperties;
  };

  const [controlProperties, setControlProperties] =
    React.useState<ControlProperties>(getInitialControlProperties());

  const getInitialDateFormat = () => {
    if (
      UISchemaElement.options &&
      (UISchemaElement.options.format === "date" ||
        UISchemaElement.options.format === "time" ||
        UISchemaElement.options.format === "date-time")
    ) {
      return UISchemaElement.options;
    }
    return {
      format: "date",
      dateFormat: "DD-MM-YYYY",
      dateSaveFormat: "DD-MM-YYYY",
      timeFormat: "DD-MM-YYYY",
      timeSaveFormat: "DD-MM-YYYY",
      dateTimeFormat: "DD-MM-YYYY",
      dateTimeSaveFormat: "DD-MM-YYYY",
    };
  };

  const [dateFormatProperties, setDateFormatProperties] =
    useState<DateFormatProperties>(
      getInitialDateFormat() as DateFormatProperties
    );

  const getInitialListFormat = () => {
    if (
      UISchemaElement.options &&
      (UISchemaElement.options.format === "select" ||
        UISchemaElement.options.format === "radio")
    ) {
      return UISchemaElement.options;
    }
    return {
      format: "select",
    };
  };

  const [listFormatProperties, setListFormatProperties] =
    useState<ListFormatProperties>(
      getInitialListFormat() as ListFormatProperties
    );

  const getIntitalListText = () => {
    if (controlProperties.enum) {
      return controlProperties.enum.toString().replace(",", ", ");
    }
    return "";
  };

  const [listText, setListText] = useState(getIntitalListText());

  const elementId = UISchemaElement.elementId;

  const handleTypeChange = (event: SelectChangeEvent) => {
    if (event.target.value === "Date") {
      setControlProperties((prev) => {
        delete prev.pattern;
        delete prev.enum;
        delete prev.maximum;
        delete prev.minimum;
        delete prev.maxLength;
        delete prev.minLength;
        return {
          ...prev,
          type: event.target.value,
          pattern: "[0-9]{2}-[0-9]{2}-[1-2][0-9]{3}",
        };
      });
    } else {
      setControlProperties((prev) => {
        delete prev.pattern;
        delete prev.enum;
        delete prev.maximum;
        delete prev.minimum;
        delete prev.maxLength;
        delete prev.minLength;
        return {
          ...prev,
          type: event.target.value,
        };
      });
    }
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    let value: string | number = event.target.value;
    if (
      property === "minLength" ||
      property === "maxLength" ||
      property === "minimum" ||
      property === "maximum"
    ) {
      value = Number(value);
    }
    setControlProperties((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleIntegerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setControlProperties((prev) => ({ ...prev, type: "Integer" }));
    } else {
      setControlProperties((prev) => ({ ...prev, type: "Number" }));
    }
  };

  const handleDateTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).value === "date") {
      setDateFormatProperties((prev) => ({
        ...prev,
        format: (event.target as HTMLInputElement).value,
        dateFormat: "DD-MM-YYYY",
        dateSaveFormat: "DD-MM-YYYY",
      }));
      const pattern = getPattern("DD-MM-YYYY");
      setControlProperties((prev) => ({
        ...prev,
        pattern,
      }));
    }
    if ((event.target as HTMLInputElement).value === "time") {
      setDateFormatProperties((prev) => ({
        ...prev,
        format: (event.target as HTMLInputElement).value,
        timeFormat: "HH:mm",
        timeSaveFormat: "HH:mm",
      }));
      const pattern = getPattern("HH:mm");
      setControlProperties((prev) => ({
        ...prev,
        pattern,
      }));
    }
    if ((event.target as HTMLInputElement).value === "date-time") {
      setDateFormatProperties((prev) => ({
        ...prev,
        format: (event.target as HTMLInputElement).value,
        dateTimeFormat: "DD-MM-YYYY HH:mm",
        dateTimeSaveFormat: "DD-MM-YYYY HH:mm",
      }));
      const pattern = getPattern("DD-MM-YYYY HH:mm");
      setControlProperties((prev) => ({
        ...prev,
        pattern,
      }));
    }
  };

  const handleDateFormatChange = (event: SelectChangeEvent) => {
    const views = getViews(event.target.value);
    let tempDateFormatProperties = dateFormatProperties;
    if (dateFormatProperties.format === "date") {
      tempDateFormatProperties.dateFormat = event.target.value;
      tempDateFormatProperties.dateSaveFormat = event.target.value;
    }
    if (dateFormatProperties.format === "time") {
      tempDateFormatProperties.timeFormat = event.target.value;
      tempDateFormatProperties.timeSaveFormat = event.target.value;
    }
    if (dateFormatProperties.format === "date-time") {
      tempDateFormatProperties.dateTimeFormat = event.target.value;
      tempDateFormatProperties.dateTimeSaveFormat = event.target.value;
    }

    if (views) {
      tempDateFormatProperties.views = views;
    }
    const pattern = getPattern(event.target.value);
    setControlProperties((prev) => ({
      ...prev,
      pattern,
    }));
    setDateFormatProperties((_prev) => ({ ...tempDateFormatProperties }));
  };

  const handleListTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setListText(event.target.value);

    const listArray = event.target.value.split(",");
    if (listArray.length > 0) {
      setControlProperties((prev) => ({
        ...prev,
        enum: listArray,
      }));
    }
  };

  const handleListTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListFormatProperties((_prev) => ({
      format: (event.target as HTMLInputElement).value,
    }));
  };

  const getType = () => {
    switch (controlProperties.type) {
      case "Text":
        return "string";
      case "Number":
        return "number";
      case "Integer":
        return "integer";
      case "Checkbox":
        return "boolean";
      case "Date":
        return "string";
      case "List":
        return "string";

      default:
        return "string";
    }
  };

  interface Properties {
    type: string;
    [key: string]: string | number | string[];
  }

  const path = getPath(uischema, [uischema.elementId], UISchemaElement) || [
    uischema.elementId,
  ];

  const elementIndex = parentElements.findIndex(
    (item) => item.elementId === UISchemaElement.elementId
  );

  useEffect(() => {
    if (controlProperties.type) {
      let tempSchema = schema;
      let property: Properties = {} as Properties;
      for (const item in controlProperties) {
        if (item === "type") {
          property["type"] = getType();
          continue;
        }
        property[item] = controlProperties[item];
      }

      let tempUISchema = uischema;
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

      delete tempElement["options"];
      if (controlProperties.type === "Date") {
        tempElement["options"] = dateFormatProperties;
      }
      if (controlProperties.type === "List") {
        tempElement["options"] = listFormatProperties;
        
      }

      if (tempSchema.properties) {
        tempSchema.properties[elementId] = property;
      }

      updateSchema(tempSchema, tempUISchema);
    }
  }, [controlProperties, dateFormatProperties, listFormatProperties]);

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

  const handleDelete = async () => {
    try {
      await confirm({
        title: "Confirm",
        description: "Are you sure you want to delete this item?",
      });
    } catch (e) {
      return;
    }

    let tempSchema = schema;
    let tempUISchema = uischema;

    let tempElement = tempUISchema;

    if (path)
      for (const [i, v] of path.entries()) {
        if (i !== 0) {
          if (tempElement.elements) {
            // get element list for the current layout element
            if (i === path.length - 1) {
              const control = tempElement.elements.find(
                (item) => item.elementId === UISchemaElement.elementId
              );

              if (tempSchema.properties && control) {
                delete tempSchema.properties[control.elementId];
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
          // handle deleting property in 1st "layer"
        } else {
          if (tempElement.elements) {
            const control = tempElement.elements.find(
              (item) => item.elementId === UISchemaElement.elementId
            );
            if (tempSchema.properties && control) {
              delete tempSchema.properties[control.elementId];
            }
          }
        }
      }

    updateSchema(tempSchema, uischema);
  };

  const typeOptions = ["Text", "Number", "Checkbox", "Date", "List"];
  const getSelectValue = (value: string | string[]) => {
    if (value === "Integer") {
      return "Number";
    }
    return value;
  };

  const getDateFormatOptions = () => {
    switch (dateFormatProperties.format) {
      case "date":
        return ["DD-MM-YYYY", "YYYY-MM-DD", "DD-MM-YY", "YYYY", "MM-YYYY"];
      case "time":
        return ["HH:mm"];
      case "date-time":
        return ["DD-MM-YYYY HH:mm", "YYYY-MM-DD HH:mm", "DD-MM-YY HH:mm"];

      default:
        return ["DD-MM-YYYY", "YYYY-MM-DD", "DD-MM-YY", "YYYY", "MM-YYYY"];
    }
  };
  const getViews = (value: string) => {
    switch (value) {
      case "YYYY":
        return ["year"];
      case "MM-YYYY":
        return ["month", "year"];

      default:
        return undefined;
    }
  };

  const getPattern = (value: string) => {
    switch (value) {
      case "DD-MM-YYYY":
        return "[0-9]{2}-[0-9]{2}-[1-2][0-9]{3}";
      case "DD-MM-YYYY HH:mm":
        return "[0-9]{2}-[0-9]{2}-[1-2][0-9]{3} ([01][0-9]|2[0-3]):([0-5][0-9])";
      case "DD-MM-YY":
        return "[0-9]{2}-[0-9]{2}-[0-9]{2}";
      case "DD-MM-YY HH:mm":
        return "[0-9]{2}-[0-9]{2}-[0-9]{2} ([01][0-9]|2[0-3]):([0-5][0-9])";
      case "YYYY":
        return "[1-2][0-9]{3}";
      case "MM-YYYY":
        return "[0-9]{2}-[1-2][0-9]{3}";
      case "YYYY-MM-DD":
        return "[1-2][0-9]{3}-[0-9]{2}-[0-9]{2}";
      case "YYYY-MM-DD HH:mm":
        return "[1-2][0-9]{3}-[0-9]{2}-[0-9]{2} ([01][0-9]|2[0-3]):([0-5][0-9])";

      default:
        return "[0-9]{2}-[0-9]{2}-[1-2][0-9]{3}";
    }
  };

  const getDateFormatValue = () => {
    switch (dateFormatProperties.format) {
      case "date":
        return dateFormatProperties.dateFormat;
      case "time":
        return dateFormatProperties.timeFormat;
      case "date-time":
        return dateFormatProperties.dateTimeFormat;
      default:
        return dateFormatProperties.dateFormat;
    }
  };

  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <StyledControlContainer>
      <StyledRowContainer>
        <StyledInputRow>
          <TextField
            id="standard-basic"
            label="Title"
            variant="standard"
            sx={{ m: 1, flex: 2, minWidth: 120 }}
            value={controlProperties.title}
            onChange={(e) => handleTextChange(e, "title")}
          />
          {!mobile && (
            <FormControl sx={{ m: 2, minWidth: 120, flex: 1 }} size="small">
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                labelId="type-select"
                id="type-select"
                value={getSelectValue(controlProperties.type) as string}
                label="Type"
                onChange={handleTypeChange}
                MenuProps={{ TransitionComponent: Fade }}
              >
                {typeOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {mobile && (
            <FormControl sx={{ m: 1, minWidth: 120, flex: 1 }}>
              <InputLabel variant="standard" id="type-select-label">
                Type
              </InputLabel>
              <Select
                labelId="type-select"
                id="type-select"
                value={getSelectValue(controlProperties.type) as string}
                label="Type"
                onChange={handleTypeChange}
                MenuProps={{ TransitionComponent: Fade }}
                variant="standard"
              >
                {typeOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </StyledInputRow>
        {controlProperties.type === "Text" && (
          <StyledInputRow>
            <TextField
              id="standard-basic"
              label="Min Length"
              variant="standard"
              sx={{ m: 1, flex: 1, minWidth: 120 }}
              value={
                controlProperties.minLength ? controlProperties.minLength : ""
              }
              onChange={(e) => handleTextChange(e, "minLength")}
              type="number"
            />
            <TextField
              id="standard-basic"
              label="Max Length"
              variant="standard"
              sx={{ m: 1, flex: 1, minWidth: 120 }}
              value={
                controlProperties.maxLength ? controlProperties.maxLength : ""
              }
              onChange={(e) => handleTextChange(e, "maxLength")}
              type="number"
              /*   InputLabelProps={{
              shrink: true,
            }} */
            />

            <TextField
              id="standard-basic"
              label="Pattern"
              variant="standard"
              sx={{ m: 1, flex: 2, minWidth: 120 }}
              value={controlProperties.pattern ? controlProperties.pattern : ""}
              onChange={(e) => handleTextChange(e, "pattern")}
            />
          </StyledInputRow>
        )}
        {(controlProperties.type === "Number" ||
          controlProperties.type === "Integer") && (
          <StyledInputRow>
            <TextField
              id="standard-basic"
              label="Minimum"
              variant="standard"
              sx={{ m: 1, flex: 1, minWidth: 120 }}
              value={controlProperties.minimum ? controlProperties.minimum : ""}
              onChange={(e) => handleTextChange(e, "minimum")}
              type="number"
            />
            <TextField
              id="standard-basic"
              label="Maximum"
              variant="standard"
              sx={{ m: 1, flex: 1, minWidth: 120 }}
              value={controlProperties.maximum ? controlProperties.maximum : ""}
              onChange={(e) => handleTextChange(e, "maximum")}
              type="number"
            />
            <FormControlLabel
              sx={{ m: 1, flex: 1, minWidth: 120 }}
              label="Integer"
              control={
                <Checkbox
                  checked={controlProperties.type === "Integer" ? true : false}
                  onChange={handleIntegerChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
            ></FormControlLabel>
          </StyledInputRow>
        )}
        {controlProperties.type === "Date" && (
          <StyledInputRow>
            <RadioGroup
              aria-labelledby="date-options"
              name="date-options"
              value={dateFormatProperties.format}
              onChange={handleDateTypeChange}
              sx={{
                m: 1,
                flexDirection: mobile ? "column" : "row",
                flex: 2,
                minWidth: 120,
              }}
            >
              <FormControlLabel
                disabled={controlProperties.format === "string"}
                value="date"
                control={<Radio />}
                label="Date"
              />
              <FormControlLabel
                disabled={controlProperties.format === "string"}
                value="time"
                control={<Radio />}
                label="Time"
              />
              <FormControlLabel
                disabled={controlProperties.format === "string"}
                value="date-time"
                control={<Radio />}
                label="Date & Time"
              />
            </RadioGroup>
            {!mobile && (
              <FormControl
                disabled={controlProperties.format === "time"}
                sx={{ m: 2, minWidth: 120, flex: 1 }}
                size="small"
              >
                <InputLabel id="date-format-select-label">Format</InputLabel>
                <Select
                  labelId="date-format-select"
                  id="date-format-select"
                  value={getDateFormatValue()}
                  label="Date Format"
                  onChange={handleDateFormatChange}
                  MenuProps={{ TransitionComponent: Fade }}
                >
                  {getDateFormatOptions().map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {mobile && (
              <FormControl
                disabled={controlProperties.format === "time"}
                sx={{ m: 1, minWidth: 120, flex: 1 }}
                variant="standard"
              >
                <InputLabel id="date-format-select-label">Format</InputLabel>
                <Select
                  labelId="date-format-select"
                  id="date-format-select"
                  value={getDateFormatValue()}
                  label="Date Format"
                  onChange={handleDateFormatChange}
                  MenuProps={{ TransitionComponent: Fade }}
                >
                  {getDateFormatOptions().map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </StyledInputRow>
        )}
        {controlProperties.type === "List" && (
          <StyledInputRow>
            <TextField
              id="standard-basic"
              label="List"
              variant="standard"
              sx={{ m: 1, flex: 2, minWidth: 120 }}
              value={listText}
              onChange={handleListTextChange}
            />
            <RadioGroup
              aria-labelledby="list-options"
              name="list-options"
              value={listFormatProperties.format}
              onChange={handleListTypeChange}
              sx={{ m: 1, flexDirection: "row", flex: 1 }}
            >
              <FormControlLabel
                value="select"
                control={<Radio />}
                label="Select"
              />
              <FormControlLabel
                value="radio"
                control={<Radio />}
                label="Radio"
              />
            </RadioGroup>
          </StyledInputRow>
        )}
      </StyledRowContainer>
      <StyledButtonContainer>
        <IconButton
          size="medium"
          sx={{ margin: "0px 0px auto 0px" }}
          onClick={() => handleDelete()}
        >
          <DeleteOutlinedIcon />
        </IconButton>
        <IconButton
          disabled={elementIndex === 0 || elementIndex === -1}
          size="medium"
          sx={{ margin: "auto 0px auto 0px" }}
          onClick={() => handleShift("up")}
        >
          <ArrowUpwardOutlinedIcon />
        </IconButton>
        <IconButton
          disabled={elementIndex === parentElements.length - 1}
          size="medium"
          sx={{ margin: "auto 0px 0px 0px" }}
          onClick={() => handleShift("down")}
        >
          <ArrowDownwardOutlinedIcon />
        </IconButton>
      </StyledButtonContainer>
    </StyledControlContainer>
  );
};

export default Control;
