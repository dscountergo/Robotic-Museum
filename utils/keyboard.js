export function setupKeyboardListeners(isMoving) {
    window.addEventListener('keydown', (event) => {
        isMoving[event.key.toLowerCase()] = true; // Zapamiętanie stanu klawisza
    }, false);

    window.addEventListener('keyup', (event) => {
        isMoving[event.key.toLowerCase()] = false; // Wyłączenie stanu klawisza
    }, false);
}
