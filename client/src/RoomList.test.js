jest.mock("svelte-apollo", () => ({
  query: jest.fn(),
}));
import RoomList from "./RoomList.svelte";
import { render } from "@testing-library/svelte";
import { query as mockedQuery } from "svelte-apollo";
import { readable } from "svelte/store";
import userEvent from "@testing-library/user-event";

const mockStore = (value) => readable(value, () => () => {});

it("Renders a loading state", async () => {
  mockedQuery.mockReturnValue(mockStore({ loading: true }));

  const { getByText } = render(RoomList, { setRoom: jest.fn(), active: "one" });
  const loading = getByText("Loading...");

  expect(loading).toBeTruthy();
});

it("Renders an empty state", async () => {
  mockedQuery.mockReturnValue(
    mockStore({
      loading: false,
      data: {
        channelList: [],
      },
    })
  );

  const { getByText } = render(RoomList, { setRoom: jest.fn(), active: "one" });
  const empty = getByText("No channels found");

  expect(empty).toBeTruthy();
});

it("Renders rooms from store", async () => {
  mockedQuery.mockReturnValue(
    mockStore({
      loading: false,
      data: {
        channelList: [
          { name: "one", id: "1" },
          { name: "two", id: "2" },
        ],
      },
    })
  );

  const { getByText } = render(RoomList, { setRoom: jest.fn(), active: "one" });
  const one = getByText("one");
  const two = getByText("two");

  expect(one).toBeTruthy();
  expect(two).toBeTruthy();
});

it("Renders active room from passed prop", async () => {
  mockedQuery.mockReturnValue(
    mockStore({
      loading: false,
      data: {
        channelList: [
          { name: "one", id: "1" },
          { name: "two", id: "2" },
        ],
      },
    })
  );

  const { getByText } = render(RoomList, { setRoom: jest.fn(), active: "1" });
  const one = getByText("one");

  expect(one.classList.contains("active")).toBeTruthy();
});

it("sets active room when clicked", async () => {
  mockedQuery.mockReturnValue(
    mockStore({
      loading: false,
      data: {
        channelList: [
          { name: "one", id: "1" },
          { name: "two", id: "2" },
        ],
      },
    })
  );

  const setRoom = jest.fn();

  const { getByText } = render(RoomList, { setRoom, active: "1" });
  const two = getByText("two");

  await userEvent.click(two);

  expect(setRoom).toHaveBeenCalledWith("2");
});
