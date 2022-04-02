export interface ShortcutsKey {
  key: string | number;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

export type ShortcutsHandler = (key: ShortcutsKey) => void

interface Binding {
  key: ShortcutsKey;
  handler: ShortcutsHandler;
}

type Bindings = {
  [key in number | string]: Binding[] | Bindings;
};

export interface Options extends ShortcutsKey {
  handler: ShortcutsHandler
}

export enum Keyboard {
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  ESCAPE = 27,
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  DELETE = 46,
}

export class Shortcuts {
  bindings: Bindings;

  constructor(container?: HTMLElement, options?: Options[])

  listen(): void;

  uninstall(): void;

  addBinding(key: ShortcutsKey, handler: ShortcutsHandler): void;
}

export default Shortcuts;