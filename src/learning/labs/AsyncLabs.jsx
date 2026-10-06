import React, { useCallback, useEffect, useState } from "react";
import { useResources } from "../resources";

function RoomSubscription({ room, log }) {
  const [message, setMessage] = useState("No message received");
  useEffect(() => {
    setMessage("No message received");
    const receive = (event) => {
      setMessage(event.detail);
      log("message", room);
    };
    log("setup", room);
    window.addEventListener("room:" + room, receive);
    return () => {
      window.removeEventListener("room:" + room, receive);
      log("cleanup", room);
    };
  }, [room, log]);
  return (
    <p role="status">
      {room}: {message}
    </p>
  );
}
export function EffectLab({ onExplore }) {
  const [mounted, setMounted] = useState(false);
  const [room, setRoom] = useState("JSX");
  const [events, setEvents] = useState([]);
  const log = useCallback(
    (type, room) => setEvents((items) => [...items.slice(-11), { type, room }]),
    [],
  );
  return (
    <>
      <div className="button-row">
        <button
          onClick={() => {
            setMounted((v) => !v);
            onExplore();
          }}
        >
          {mounted ? "Unmount subscription" : "Mount subscription"}
        </button>
        <button
          disabled={!mounted}
          className="secondary"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("room:" + room, {
                detail: "Hello from the event system!",
              }),
            );
            onExplore();
          }}
        >
          Send room message
        </button>
      </div>
      <label>
        Subscribed room
        <select
          value={room}
          onChange={(e) => {
            setRoom(e.target.value);
            onExplore();
          }}
        >
          <option>JSX</option>
          <option>Effects</option>
        </select>
      </label>
      {mounted ? (
        <RoomSubscription room={room} log={log} />
      ) : (
        <p>Subscription is unmounted.</p>
      )}
      <h3>Observed lifecycle</h3>
      <p className="muted">
        These events come from the real Effect. Strict Mode adds a development
        setup → cleanup → setup check.
      </p>
      <ol className="timeline" aria-label="Effect lifecycle">
        {events.map((event, i) => (
          <li key={i}>
            <strong>{event.type}</strong>
            <span>{event.room}</span>
          </li>
        ))}
      </ol>
      {!events.length && <p>Mount the subscription to begin.</p>}
    </>
  );
}
export function ResourceLab({ onExplore = () => {} }) {
  const [topic, setTopic] = useState("foundations");
  const [scenario, setScenario] = useState("success");
  const [attempt, setAttempt] = useState(0);
  const result = useResources(topic, scenario, attempt);
  return (
    <>
      <p className="badge">Local asynchronous teaching service</p>
      <div className="field-row">
        <label>
          Resource topic
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              onExplore();
            }}
          >
            <option value="foundations">Foundations · slower response</option>
            <option value="effects">Effects · faster response</option>
          </select>
        </label>
        <label>
          Response scenario
          <select
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              onExplore();
            }}
          >
            <option value="success">Success</option>
            <option value="empty">Empty response</option>
            <option value="error">Simulated failure</option>
          </select>
        </label>
      </div>
      <div role="status" aria-live="polite">
        {result.status === "loading" && <p>Loading resources…</p>}
        {result.status === "error" && (
          <p className="error-text">
            Could not load resources. The service simulated an error.
          </p>
        )}
        {result.status === "success" && !result.items.length && (
          <p>No resources for this scenario. Try Success.</p>
        )}
        {result.status === "success" && result.items.length > 0 && (
          <ul>
            {result.items.map((item) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="secondary"
        onClick={() => {
          setScenario("success");
          setAttempt((n) => n + 1);
          onExplore();
        }}
      >
        Retry successful request
      </button>
      <p className="muted">
        Switch topics quickly: obsolete requests are aborted and cannot replace
        the latest results. Retry resets the simulated failure.
      </p>
    </>
  );
}
