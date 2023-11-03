/* import { UISchemaElement, JsonSchema } from "@jsonforms/core"; */

type UISchema = UIProperty;

type UIProperty = {
  type: keyof typeof UIPropertyTypeEnums;
  scope?: string;
  label?: string | boolean;
  elements?: UIProperty[];
  options?: Options;
  rule?: Rule;
  layer: number;
  elementIndex: number;
};

enum UIPropertyTypeEnums {
  Control,
  VerticalLayout,
  HorizontalLayout,
  Group,
  Categorization,
}

type Options = {
  detail?: UIProperty | keyof typeof OptionDetailEnums;
  format?: keyof typeof OptionFormatEnums;
  elementLabelProp?: string;
  showSortButtons?: boolean;
  multi?: boolean;
};

enum OptionDetailEnums {
  DEFAULT,
  GENERATED,
  REGISTERED,
}

enum OptionFormatEnums {
  radio,
}

type Rule = {
  effect: /* keyof typeof RuleEffectEnums */ /* any */ import("@jsonforms/core").RuleEffect;
  condition: /* Condition */ /* any */ import("@jsonforms/core").Condition;
};

enum RuleEffectEnums {
  HIDE,
  SHOW,
  ENABLE,
  DISABLE,
}

type Condition = {
  scope: string;
  schema: any; // lots of different ways the schema can be structured...
};

type UISchemaElementImport = import("@jsonforms/core").UISchemaElement &
  import("@jsonforms/core").Scopable &
  import("@jsonforms/core").Labelable;

interface UISchemaElementCustom extends UISchemaElementImport {
  elementId: string;
  elements?: UISchemaElementCustom[];
}
