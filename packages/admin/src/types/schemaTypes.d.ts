/* type Schema = {
    type: string;
    properties?: Properties;
    required?: string[];
  };

type Properties = {
  [key: string]: Property;
};

type Property = {
    type: keyof typeof PropertyTypeEnums;
    format?: keyof typeof PropertyFormatEnums;
    minLength?: number;
    maxLength?: number;
    title?: string;
    enum?: string[];
    maximum?: number;
  };

enum PropertyTypeEnums {
  object,
  array,
  string,
  boolean,
  integer,
  number,
}

enum PropertyFormatEnums {
  date,
  time
} */




