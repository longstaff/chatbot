jest.mock("svelte-apollo", () => ({
  mutation: jest.fn(),
}));
import SignUp from "./SignUp.svelte";
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { mutation as mockedMutation } from "svelte-apollo";

it("Updates mutate with entered name", async () => {
  const innerMutate = jest.fn();
  mockedMutation.mockReturnValue(innerMutate);

  const { getByTestId } = render(SignUp, {
    setUser: jest.fn(),
  });
  const input = getByTestId("text-input");

  await userEvent.type(input, "abc{enter}");

  expect(innerMutate).toHaveBeenCalledWith({ variables: { name: "abc" } });
});

it("Blocks calls while waiting for resolution", async () => {
  const innerMutate = jest.fn();
  mockedMutation.mockReturnValue(innerMutate);

  const { getByTestId } = render(SignUp, {
    setUser: jest.fn(),
  });
  const input = getByTestId("text-input");

  await userEvent.type(input, "abc{enter}cba{enter}asdf{enter}");

  expect(innerMutate).toHaveBeenCalledTimes(1);
});

it("Updates mutate with entered name", async () => {
  const newUser = {
    name: "name",
    id: "id",
  };
  const innerMutate = jest
    .fn()
    .mockResolvedValue({ data: { registerUser: newUser } });
  const setUser = jest.fn();
  mockedMutation.mockReturnValue(innerMutate);

  const { getByTestId } = render(SignUp, {
    setUser,
  });
  const input = getByTestId("text-input");

  await userEvent.type(input, "abc{enter}");

  expect(setUser).toHaveBeenCalledWith(newUser);
});
