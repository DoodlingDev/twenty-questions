import React from "react";
import FormNode from "../../src/components/formNode";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

it("is true", () => {
  expect(true).toBe(true);
})
