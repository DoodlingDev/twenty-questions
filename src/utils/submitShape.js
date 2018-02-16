// @flow

export default function createShapeMap(formProperties: q20$RenderedNode[]) {
  let submitShape = [];
  const result = recurse(formProperties);
  submitShape = submitShape.concat(recurse(formProperties));
  return submitShape;
}

function recurse(formProperties: q20$RenderedNode[]) {
  let outputBuffer = [];
  for (let i = 0, l = formProperties.length; i < l; i++) {
    const propertyObject = formProperties[i];
    switch (propertyObject.type) {
      case "string":
      case "number":
      case "boolean":
        // add to array
        outputBuffer.push({
          name: propertyObject.name,
          validates: propertyObject.validates,
        });

        break;
      case "array":
      case "object":
        if (!propertyObject.properties) {
          throw new Error(
            `${propertyObject.type} type named ${propertyObject.name} has no properties.`,
          );
        }
        let propertyArray = {
          name: propertyObject.name,
          validates: propertyObject.validates,
          type: propertyObject.type,
          children: recurse(propertyObject.properties),
        };
        outputBuffer.push(propertyArray);

        break;
      case "object:nosubmit":
        if (!propertyObject.properties) {
          throw new Error(
            `${propertyObject.type} type named ${propertyObject.name} has no properties.`,
          );
        }
        let recurseInto = recurse(propertyObject.properties);
        outputBuffer = outputBuffer.concat(recurseInto);

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
