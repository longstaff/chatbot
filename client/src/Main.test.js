import mockedRoomList from "./test/MockRoomList.svelte";
import mockedRoom from "./test/MockRoom.svelte";
jest.mock("./RoomList.svelte", () => ({ default: mockedRoomList }));
jest.mock("./Room.svelte", () => ({ default: mockedRoom }));

import Main from "./Main.svelte";
import { render } from "@testing-library/svelte";

import userEvent from "@testing-library/user-event";

it("Renders an empty state by default", async () => {
  const { getByTestId } = render(Main, { user: { name: "name" } });

  const empty = getByTestId("empty-title");

  expect(empty).toBeTruthy();
});

it("Renders a room when selected from the list", async () => {
  const { getByTestId, getByText } = render(Main, { user: { name: "name" } });

  const RoomList = getByTestId("roomList");
  await userEvent.click(RoomList);

  const room = getByTestId("room");

  expect(room).toBeTruthy();
  expect(getByText("room")).toBeTruthy();
  expect(getByText("name")).toBeTruthy();
});
