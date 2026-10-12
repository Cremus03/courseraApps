import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {seedCategories} from "./db/seed.js";
import {BrowserRouter} from "react-router-dom";

seedCategories()

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </StrictMode>,
)
