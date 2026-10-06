import React, { useId, useState } from "react";

const skies = {
  day: {
    top: "#0047ab",
    middle: "#00ced1",
    bottom: "#fff0a8",
    sun: "#ffd000",
    sea: "#0047ab",
    pool: "#48cae4",
    label: "A bright start to your next idea.",
  },
  dusk: {
    top: "#3a0ca3",
    middle: "#ff6b6b",
    bottom: "#ffd000",
    sun: "#ffe090",
    sea: "#463d91",
    pool: "#5fbec8",
    label: "A little reflection. A little more understanding.",
  },
  night: {
    top: "#0d1b2a",
    middle: "#173e85",
    bottom: "#977ab8",
    sun: "#fff9f2",
    sea: "#132b4c",
    pool: "#24619a",
    label: "Your next small step, at your own pace.",
  },
};

// A responsive vector scene inspired by the supplied coastal academy canvas.
// Scene controls are independent of the workspace's saved light/dark preference.
export default function CoastalStudio() {
  const [scene, setScene] = useState("day");
  const gradientId = useId();
  const sky = skies[scene];
  return (
    <div className="studio-frame">
      <div className="studio-toolbar">
        <span className="studio-title">
          <span className="status-dot" /> REACT STUDY STUDIO
        </span>
        <div className="scene-controls" role="group" aria-label="Studio sky">
          {Object.keys(skies).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={scene === mode}
              onClick={() => setScene(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <div className="studio-art" data-scene={scene}>
        <svg
          viewBox="0 0 640 420"
          role="img"
          aria-label={`${scene} at a coastal study studio, with an open laptop beside a swimming pool`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sky.top} />
              <stop offset="68%" stopColor={sky.middle} />
              <stop offset="100%" stopColor={sky.bottom} />
            </linearGradient>
          </defs>
          <rect width="640" height="255" fill={`url(#${gradientId})`} />
          <circle
            cx="475"
            cy="105"
            r="46"
            fill={sky.sun}
            stroke="#0d1b2a"
            strokeWidth="3"
          />
          {scene === "night" && (
            <g fill="#fff9f2">
              <circle cx="255" cy="44" r="2" />
              <circle cx="360" cy="89" r="2" />
              <circle cx="585" cy="46" r="2" />
              <circle cx="548" cy="172" r="2" />
              <circle cx="302" cy="138" r="2" />
            </g>
          )}
          <rect y="255" width="640" height="40" fill={sky.sea} />
          <path
            d="M0 269h132m43 0h38m101 10h98m87-12h141"
            stroke="#fff9f2"
            strokeWidth="2"
            opacity=".4"
          />
          <path d="M0 295H640V420H0Z" fill="#fff9f2" />
          <path
            d="M300 295H640V420H223Z"
            fill={sky.pool}
            stroke="#0d1b2a"
            strokeWidth="3"
          />
          <path
            d="M323 309h317M276 365h364M348 299l-45 121M418 299l-30 121M488 299l-15 121M558 299v121"
            stroke="#fff"
            strokeWidth="2"
            opacity=".3"
          />
          <path
            d="M438 338h54m-6 47h78m-215-2h39m173-65h31"
            stroke="#fff9f2"
            strokeWidth="3"
            opacity=".8"
          />
          <path d="M0 341h100l83 79H0Z" fill="#d7c7b8" />
          <path
            d="M47 0v296M0 34h226V0"
            fill="none"
            stroke="#0d1b2a"
            strokeWidth="14"
          />
          <path d="M52 44h164L139 59H52Z" fill="#0d1b2a" opacity=".2" />
          <g stroke="#0d1b2a" strokeWidth="3">
            <path d="M145 323h157l42 43H97Z" fill="#ff6b6b" />
            <path d="M116 366v54m207-54v54" fill="none" strokeWidth="8" />
            <path d="M159 244h137l-7 91H169Z" fill="#0d1b2a" />
            <path d="M169 255h116l-5 67H177Z" fill="#0047ab" />
            <path d="M170 335h119l15 10H155Z" fill="#fff9f2" />
            <path
              d="m205 274-12 12 12 12m41-24 12 12-12 12m-15-28-11 33"
              stroke="#ffd000"
              strokeWidth="4"
              fill="none"
            />
            <path d="M126 301h24v27h-24z" fill="#ffd000" />
            <path d="M150 305h9v14h-9" fill="none" />
          </g>
          <g fill="#0d1b2a">
            <path d="M594 314c-7-78-1-149 22-228l7 1c-22 82-21 152-16 227z" />
            <path d="M619 95c-49-46-99-32-111-10 40-10 67 4 105 20-60-7-84 21-85 41 32-23 57-26 89-39-26 37-10 67 2 77-3-38 4-61 9-78 15 31 39 39 57 30-28-9-38-26-49-40 38 2 50-17 56-28-29 4-47 9-62 20 22-34 6-57-3-65 5 31-5 43-8 72z" />
          </g>
          <path
            d="M535 315h91l-9 36h-70Z"
            fill="#ffd000"
            stroke="#0d1b2a"
            strokeWidth="3"
          />
        </svg>
        <span className="studio-sticker">
          LESS SCROLLING.
          <br />
          MORE BUILDING. <span aria-hidden="true">↗</span>
        </span>
      </div>
      <div className="studio-caption">
        <span>YOUR NEXT IDEA STARTS HERE</span>
        <span aria-live="polite">{sky.label}</span>
      </div>
    </div>
  );
}
