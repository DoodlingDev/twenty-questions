// @flow

type q20$SubmitField = {
  name: string,
  validates: Array<string>,
};

type q20$SubmitFieldWithChildren = q20$SubmitField & {
  type: q20$NodeType,
  children: Array<*>,
};

/**
 * createShapeMap
 *   is a function that will scan through a form's object schema
 *   and return an array of what fields need to be added to the params for
 *   submit. Each field is represented by an object that holds the field's
 *   name and validations. Extra properties are added for arrays and objects:
 *   their type and children.
 *
 * @param {q20$RenderedNode[]} formProperties
 * @return {q20$SubmitField[]} Array of names and validations for the fields
 *   in question.
 */
export default function createShapeMap(
  formProperties: q20$RenderedNode[],
): ?Array<q20$SubmitField | q20$SubmitFieldWithChildren> {
  return recurse(formProperties);
}

/**
 * recurse
 *   see createShapeMap
 *
 * @param {q20$RenderedNode[]} formProperties
 * @return {q20$SubmitField[]} Array of submit field objects
 */
function recurse(
  formProperties: q20$RenderedNode[],
): ?Array<q20$SubmitField | q20$SubmitFieldWithChildren> {
  let outputBuffer: Array<q20$SubmitField> = [];
  if (formProperties.length < 1) return null;
  for (let i = 0, l = formProperties.length; i < l; i++) {
    const propertyObject = formProperties[i];
    switch (propertyObject.type) {
      case "string":
      case "number":
      case "boolean":
        outputBuffer.push({
          name: propertyObject.name || "",
          validates: propertyObject.validates || [],
        });

        break;
      case "array":
      case "object":
        if (!propertyObject.properties) {
          throw new Error(
            `${propertyObject.type} type named ${
              propertyObject.name
            } has no properties.`,
          );
        }
        let propertyArray = {
          name: propertyObject.name || "",
          validates: propertyObject.validates || [],
          type: propertyObject.type,
          children: recurse(propertyObject.properties),
        };
        outputBuffer.push(propertyArray);

        break;
      case "object:nosubmit":
        if (!propertyObject.properties) {
          throw new Error(
            `${propertyObject.type} type named ${
              propertyObject.name
            } has no properties.`,
          );
        }
        let recurseInto = recurse(propertyObject.properties);
        if (recurseInto != null) {
          outputBuffer = outputBuffer.concat(recurseInto);
        }

        break;
      default:
        throw new Error(
          `Unknown type in form properties. ${
            propertyObject.type
          } is not a valid type`,
        );
    }
  }
  return outputBuffer;
}
