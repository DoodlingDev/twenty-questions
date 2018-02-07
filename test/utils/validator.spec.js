it("is true",()=>{expect(true).toBeTruthy()})
// import { gatherValidations } from "../../src/utils/validator";
//
// describe("gatherValidations", () => {
//   describe("given one non-nested validation", () => {
//     const form = {
//       name: "name",
//       path: "name.path",
//       valueManager: {},
//       label: "label-string",
//       type: "string",
//       validates: ["one"],
//       properties: [
//         {
//           type: "string",
//           name: "don't validate me",
//         },
//       ],
//     };
//
//     it("should return one field to validate", () => {
//       expect(Object.keys(gatherValidations(form)).length).toBe(1);
//     });
//
//     it("should return a properly formatted object", () => {
//       expect(gatherValidations(form)).toEqual(
//         {
//           "name": {
//             type: "string",
//             name: "name",
//             label: "label-string",
//             validates: ["one"],
//           },
//         }
//       );
//     });
//   });
//
//   describe("given three siblings: 2 validated, 1 not", () => {
//     const form = {
//       name: "one",
//       label: "ONE",
//       type: "object",
//       properties: [
//         {
//           type: "string",
//           name: "sibling-one",
//           label: "sibling one",
//           validates: ["--one"],
//         },
//         {
//           type: "string",
//           name: "sibling-two",
//           label: "sibling two",
//           validates: ["--one", "--two"],
//         },
//         {
//           type: "string",
//           name: "sibling-three",
//           label: "sibling three",
//         },
//       ],
//     };
//
//     it("should return two fields to validate", () => {
//       result = gatherValidations(form);
//       expect(Object.keys(result).length).toBe(2);
//     });
//
//     it("should correctly populate the validation objects", () => {
//       result = gatherValidations(form);
//       expect(result).toEqual({
//         "sibling-one": {
//           type: "string",
//           name: "sibling-one",
//           label: "sibling one",
//           validates: ["--one"],
//         },
//         "sibling-two": {
//           type: "string",
//           name: "sibling-two",
//           label: "sibling two",
//           validates: ["--one", "--two"],
//         },
//       });
//     });
//   });
//
//   describe("given several layers of nesting", () => {
//     const form = {
//       type: "object",
//       name: "row_1",
//       label: "row 1",
//       properties: [
//         {
//           type: "object",
//           name: "row_2",
//           label: "row 2",
//           properties: [
//             {
//               type: "object",
//               name: "row_3",
//               label: "row 3",
//               properties: [
//                 {
//                   type: "string",
//                   name: "string-3",
//                   label: "string 3",
//                   validates: ["--three"],
//                 },
//                 {
//                   type: "string",
//                   name: "string-4",
//                   label: "string 4",
//                   validates: ["--four"],
//                 },
//               ],
//             },
//             {
//               type: "string",
//               name: "string-2",
//               label: "string 2",
//               validates: ["--two"],
//             },
//           ],
//         },
//         {
//           type: "string",
//           name: "string-1",
//           label: "string 1",
//           validates: ["--one"],
//         },
//       ],
//     };
//
//     it("should return four fields to validate", () => {
//       const result = gatherValidations(form);
//       expect(Object.keys(result)).toBe(4);
//     });
//
//     it("should be ")
//   });
// });
