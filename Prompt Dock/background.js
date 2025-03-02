let windowId = null;

chrome.action.onClicked.addListener(async () => {
  if (windowId === null) {
    // Create a new window if none exists
    const windowWidth = 400;
    const windowHeight = 600;
    
    // Get the current window to position the popup relative to it
    const currentWindow = await chrome.windows.getCurrent();
    const left = currentWindow.left + currentWindow.width - windowWidth - 20; // 20px from right edge
    
    const window = await chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: windowWidth,
      height: windowHeight,
      left: Math.max(0, left), // Ensure window is not positioned off-screen
      top: 50, // 50px from top
      focused: true
    });
    windowId = window.id;

    // Listen for window close event to reset windowId
    chrome.windows.onRemoved.addListener(function handleRemoved(removedWindowId) {
      if (removedWindowId === windowId) {
        windowId = null;
        chrome.windows.onRemoved.removeListener(handleRemoved);
      }
    });
  } else {
    // If window exists, focus it
    try {
      await chrome.windows.update(windowId, { focused: true });
    } catch (e) {
      // If there's an error (window was closed), reset windowId and create new window
      windowId = null;
      chrome.action.onClicked.dispatch();
    }
  }
});