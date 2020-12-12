jest.mock("svelte-apollo", () => ({
  query: jest.fn(),
  subscribe: jest.fn(),
  mutation: jest.fn(),
}));
import Room from "./Room.svelte";
import { render } from "@testing-library/svelte";
import {
  query as mockedQuery,
  subscribe as mockedSubscribe,
  mutation as mockedMutation,
} from "svelte-apollo";
import { readable } from "svelte/store";
import userEvent from "@testing-library/user-event";
import { GET_CHANNEL, GET_LOGS, ADD_LOG, SUBSCRIBE_TO_LOGS } from "./queries";

const mockStore = (value, refetch) => ({
  ...readable(value, () => () => {}),
  refetch,
});

it("Renders the room name", async () => {
  //Room name
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channel: { name: "name" } } }, jest.fn())
  );
  //Logs
  mockedQuery.mockReturnValueOnce(mockStore({ loading: true }, jest.fn()));
  mockedSubscribe.mockReturnValue(mockStore({ loading: true }));

  const { getByTestId } = render(Room, {
    room: "room",
    user: { name: "name" },
  });
  const name = getByTestId("room-name");

  expect(mockedQuery).toHaveBeenCalledWith(GET_CHANNEL, {
    variables: { id: "room" },
  });
  expect(name.textContent).toBe(`Room: name`);
});

it("Renders an loading element if logs are loading", async () => {
  //Room name
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channel: { name: "name" } } }, jest.fn())
  );
  //Logs
  mockedQuery.mockReturnValueOnce(mockStore({ loading: true }, jest.fn()));
  mockedSubscribe.mockReturnValue(mockStore({ loading: true }));

  const { getByTestId } = render(Room, {
    room: "room",
    user: { name: "name" },
  });
  const loading = getByTestId("loading-state");

  expect(mockedQuery).toHaveBeenCalledWith(GET_LOGS, {
    variables: { id: "room" },
  });
  expect(loading).toBeTruthy();
});

it("Renders an empty element if no logs", async () => {
  //Room name
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channel: { name: "name" } } }, jest.fn())
  );
  //Logs
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channelLog: [] } }, jest.fn())
  );
  mockedSubscribe.mockReturnValue(mockStore({ loading: true }));

  const { getByTestId } = render(Room, {
    room: "room",
    user: { name: "name" },
  });
  const empty = getByTestId("empty-state");

  expect(mockedQuery).toHaveBeenCalledWith(GET_LOGS, {
    variables: { id: "room" },
  });
  expect(empty).toBeTruthy();
});

it("Renders logs from initial load", async () => {
  //Room name
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channel: { name: "name" } } }, jest.fn())
  );
  //Logs
  mockedQuery.mockReturnValueOnce(
    mockStore(
      {
        data: {
          channelLog: [
            {
              message: "hello",
              user: { name: "name", id: "1" },
            },
          ],
        },
      },
      jest.fn()
    )
  );
  mockedSubscribe.mockReturnValue(mockStore({ loading: true }));

  const { getByText } = render(Room, {
    room: "room",
    user: { name: "name" },
  });
  const message = getByText("hello");

  expect(message).toBeTruthy();
});

it("Renders logs from subscription load", async () => {
  //Room name
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channel: { name: "name" } } }, jest.fn())
  );
  //Logs
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channelLog: [] } }, jest.fn())
  );
  mockedSubscribe.mockReturnValue(
    mockStore({
      data: {
        channelLog: {
          message: "hello",
          user: { name: "name", id: "1" },
        },
      },
    })
  );

  const { getByText } = render(Room, {
    room: "room",
    user: { name: "name" },
  });
  const message = getByText("hello");

  expect(mockedSubscribe).toHaveBeenCalledWith(SUBSCRIBE_TO_LOGS, {
    variables: { id: "room" },
  });
  expect(message).toBeTruthy();
});

it("Updates logs on submit", async () => {
  //Room name
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channel: { name: "name" } } }, jest.fn())
  );
  //Logs
  mockedQuery.mockReturnValueOnce(
    mockStore({ data: { channelLog: [] } }, jest.fn())
  );
  mockedSubscribe.mockReturnValue(mockStore({ loading: true }));
  const mutate = jest.fn();
  mockedMutation.mockReturnValue(mutate);

  const { getByTestId } = render(Room, {
    room: "room",
    user: { name: "name", id: "userId" },
  });

  const input = getByTestId("text-input");
  await userEvent.type(input, "abc{enter}");

  expect(mutate).toHaveBeenCalledWith({
    variables: {
      userId: "userId",
      channelId: "room",
      message: "abc",
    },
  });
});
