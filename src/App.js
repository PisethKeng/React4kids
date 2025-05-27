import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UseButton from './samples/useEffect.jsx'
import Home from './pages/Home/Home.jsx'
import UseState from './samples/useState'
import UseContext from './samples/useContext'
import UseReducer from './samples/useReducer'
import UseTransition from './samples/useTransition'
import ReactRouting from './samples/reactRouting'
import { useEffect } from "react";

/**
 * The main app component, which uses React Router to switch between different routes.
 * 
 * The available routes are:
 * 
 * - `/`: The home page, which shows a list of all the available hooks.
 * - `/useEffect`: An example of how to use the `useEffect` hook.
 */

export default function App() {
  document.body.style.backgroundColor = "#F8FAFC";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/useEffect" element={<UseButton />} />
        <Route path="/useState" element={<UseState />} />
        <Route path="/useContext" element={<UseContext />} />
        <Route path="/useReducer" element={<UseReducer />} />
        <Route path="/useTransition" element={<UseTransition />} />
        <Route path="/reactRouting" element={<ReactRouting />} />
      </Routes>
    </BrowserRouter>
  )
}
