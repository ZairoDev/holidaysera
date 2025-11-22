// This file handles Socket.io initialization in Next.js
// It's called from the layout or providers file

import { getSocketIO } from "./socket";

let isInitialized = false;

export function initSocketIO() {
  if (isInitialized) {
    return getSocketIO();
  }

  try {
    // For Next.js, we need an HTTP server instance
    // Socket.io will be initialized when the first connection is made
    isInitialized = true;
    console.log("Socket.io initialization module loaded");
  } catch (error) {
    console.error("Error initializing Socket.io:", error);
  }

  return getSocketIO();
}
