export const getPath = (
  initialSchemaElement: UISchemaElementCustom,
  initialPath: string[],
  parentSchemaElement: UISchemaElementCustom
): string[] | undefined => {
  let tempPath = initialPath;

  if (initialSchemaElement.elementId === parentSchemaElement.elementId) {
    return tempPath;
  }
  if (initialSchemaElement.elements) {
    for (const element of initialSchemaElement.elements) {
      if (element.elementId === parentSchemaElement.elementId) {
        tempPath.push(element.elementId);
        return tempPath;
      } else {
        let recursivePath: string[] | undefined = getPath(
          element,
          [...tempPath, element.elementId],
          parentSchemaElement
        );
        if (recursivePath) {
          return recursivePath;
        }
      }
    }
  }
};

export function moveItemInArray<T>(
  workArray: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (toIndex === fromIndex) {
    return workArray;
  }
  const target = workArray[fromIndex];
  const increment = toIndex < fromIndex ? -1 : 1;

  for (let k = fromIndex; k !== toIndex; k += increment) {
    workArray[k] = workArray[k + increment];
  }
  workArray[toIndex] = target;
  return workArray;
}
