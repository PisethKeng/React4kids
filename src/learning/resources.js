import { useEffect, useState } from "react";
export const resourceCatalog = [
  {
    id: "jsx",
    title: "Writing markup with JSX",
    topic: "foundations",
    url: "https://18.react.dev/learn/writing-markup-with-jsx",
  },
  {
    id: "state",
    title: "State as a snapshot",
    topic: "foundations",
    url: "https://18.react.dev/learn/state-as-a-snapshot",
  },
  {
    id: "effects",
    title: "Synchronizing with Effects",
    topic: "effects",
    url: "https://18.react.dev/learn/synchronizing-with-effects",
  },
  {
    id: "cleanup",
    title: "Removing Effect dependencies",
    topic: "effects",
    url: "https://18.react.dev/learn/removing-effect-dependencies",
  },
];
// A deterministic asynchronous teaching service. No account or live API is needed.
export function loadResources(topic, scenario, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      const error = new Error("Request cancelled");
      error.name = "AbortError";
      reject(error);
    };
    const timer = setTimeout(
      () => {
        signal?.removeEventListener("abort", abort);
        if (scenario === "error")
          reject(new Error("The teaching service simulated a failed request."));
        else
          resolve(
            scenario === "empty"
              ? []
              : resourceCatalog.filter((r) => r.topic === topic),
          );
      },
      topic === "foundations" ? 700 : 250,
    );
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
  });
}
export function useResources(topic, scenario, attempt) {
  const [result, setResult] = useState({ status: "loading", items: [] });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setResult({ status: "loading", items: [] });
    loadResources(topic, scenario, controller.signal)
      .then((items) => {
        if (active) setResult({ status: "success", items });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setResult({ status: "error", items: [] });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [topic, scenario, attempt]);
  return result;
}
