jest.mock("./createClient", () => ({ default: {} }));
jest.mock("svelte-apollo", () => ({ setClient: jest.fn() }));

import mockedMain from "./test/MockMain.svelte";
import mockedSignUp from "./test/MockSignUp.svelte";
jest.mock("./Main.svelte", () => ({ default: mockedMain }));
jest.mock("./SignUp.svelte", () => ({ default: mockedSignUp }));

import App from "./App.svelte";
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import { setClient as mockedSetClient } from "svelte-apollo";
import mockedClient from "./createClient";

it("Subscribes the client", async () => {
  render(App);
  expect(mockedSetClient).toHaveBeenCalledWith(mockedClient.default);
});

it("Renders the Sign Up prompt by default", async () => {
  const { getByTestId } = render(App);

  const signUp = getByTestId("signup");

  expect(signUp).toBeTruthy();
});

it("Renders the Main prompt when signup hit", async () => {
  const { getByTestId } = render(App);
  const signUp = getByTestId("signup");

  await userEvent.click(signUp);

  const main = getByTestId("main");

  expect(main).toBeTruthy();
  expect(main.textContent).toBe("name");
});
