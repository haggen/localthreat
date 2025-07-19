import { useCallback, useReducer } from "react";

type State<T> = {
  status: "idle" | "busy";
  data: null | T;
  error: null | unknown;
};

type Action<T> =
  | { type: "start" }
  | { type: "resolve"; payload: T }
  | { type: "reject"; payload: unknown };

function reducer<T>() {
  return (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "start":
        return { status: "busy", data: null, error: null };
      case "resolve":
        return { status: "idle", data: action.payload, error: null };
      case "reject":
        return { status: "idle", data: null, error: action.payload };
      default:
        return { status: "idle", data: null, error: null };
    }
  };
}

export function useAsync<T>() {
  const [state, dispatch] = useReducer(reducer<T>(), {
    status: "idle",
    data: null,
    error: null,
  });

  const execute = useCallback(async (fn: () => Promise<T>) => {
    dispatch({ type: "start" });

    try {
      const data = await fn();
      dispatch({ type: "resolve", payload: data });
      return data;
    } catch (error) {
      dispatch({ type: "reject", payload: error });
      throw error;
    }
  }, []);

  return { ...state, execute };
}
