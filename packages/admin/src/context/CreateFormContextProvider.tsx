import { JsonSchema } from "@jsonforms/core";
import React, { useState, useCallback, createContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface CreateFormContext {
  schema: JsonSchema;
  uischema: UISchemaElementCustom;
  updateSchema: (schema: JsonSchema, uischema: UISchemaElementCustom) => void;
}

type CombinedSchema = {
  schema: JsonSchema;
  uischema: UISchemaElementCustom;
};

const CreateFormContext = createContext<CreateFormContext>(
  {} as CreateFormContext
);

interface Props {
  children?: React.ReactNode;
}

const CreateFormContextProvider: React.FC<Props> = ({ children }) => {
  const [combinedSchema, setCombinedSchema] = useState<CombinedSchema>({
    schema: { type: "object", properties: {} },
    uischema: {
      elementId: uuidv4(),
      type: "VerticalLayout",
    },
  });

  const updateSchema = useCallback(
    (schema: JsonSchema, uischema: UISchemaElementCustom) => {
      setCombinedSchema((_prev) => {
        let tempCombinedSchema = combinedSchema;
        combinedSchema.schema = schema;
        combinedSchema.uischema = uischema;
        return { ...tempCombinedSchema };
      });
    },
    [combinedSchema]
  );

  const contextValue: CreateFormContext = useMemo(
    () => ({
      schema: combinedSchema.schema,
      uischema: combinedSchema.uischema,
      updateSchema,
    }),
    [combinedSchema, updateSchema]
  );

  return (
    <CreateFormContext.Provider value={contextValue}>
      {children}
    </CreateFormContext.Provider>
  );
};

export { CreateFormContextProvider, CreateFormContext };
