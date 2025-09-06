import { useEffect, useState } from 'react';

type Key =
  | 'Enter'
  | 'Escape'
  | ' '
  | 'Tab'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'Meta'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

function useKeyPress(targetKey: Key | `${Key}+${Key}`, cb: () => void) {
  const keyQueue: Key[] = [];
  const countKey = targetKey.split('+').length;

  function addKey(key: Key) {
    if (!targetKey.includes(key)) return;
    if (keyQueue.length === countKey) {
      keyQueue.shift();
    }
    keyQueue.push(key);
  }
  function isEquel() {
    return keyQueue.slice(0, countKey).join('+').trim() === targetKey.trim();
  }

  function downHandler(event: KeyboardEvent) {
    addKey(event.key as Key);
    if (isEquel()) {
      cb();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey]);
}

export default useKeyPress;
