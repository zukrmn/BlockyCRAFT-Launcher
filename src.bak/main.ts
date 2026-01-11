import './app.css'
import App from './App.svelte'
import { mount } from 'svelte'

const target = document.getElementById('app')!;
console.log('Main.ts execution started');


// Error Handler for Blank Screen Debugging
window.addEventListener('error', (event) => {
  document.body.innerHTML += `<div style="color: red; padding: 20px; z-index: 9999; position: absolute; background: rgba(0,0,0,0.8); top: 0; left: 0; width: 100%;">
    <h3>Renderer Error:</h3>
    <pre>${event.message}</pre>
    <pre>${event.filename}:${event.lineno}:${event.colno}</pre>
  </div>`;
});

// Mount App
let app;
try {
  app = mount(App, {
    target: target,
  });
} catch (e) {
  console.error("Mount Error:", e);
  document.body.innerHTML += `<div style="color: red; padding: 20px;"><h3>Mount Error:</h3><pre>${e}</pre></div>`;
}

export default app
