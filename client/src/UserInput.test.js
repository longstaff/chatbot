import UserInput from "./UserInput.svelte";
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

it("Renders button with label state", async () => {
  const { getByTestId } = render(UserInput, {
    submit: jest.fn(),
    label: "label",
  });
  const button = getByTestId("text-submit");

  expect(button.textContent).toBe("label");
});

it("submits value when button clicked", async () => {
  const submit = jest.fn();

  const { getByTestId } = render(UserInput, { submit, label: "click me" });
  const button = getByTestId("text-submit");
  const input = getByTestId("text-input");

  await userEvent.type(input, "abc");
  await userEvent.click(button);

  expect(submit).toHaveBeenCalledWith("abc");
});

it("submits value when enter presed", async () => {
  const submit = jest.fn();

  const { getByTestId } = render(UserInput, { submit, label: "click me" });
  const button = getByTestId("text-submit");
  const input = getByTestId("text-input");

  await userEvent.type(input, "abc{enter}");

  expect(submit).toHaveBeenCalledWith("abc");
});
