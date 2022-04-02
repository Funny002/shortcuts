'use script';

const keyArr = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'];

const keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, ESCAPE: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46 };

const getType = target => Object.prototype.toString.call(target).slice(8, -1).toLocaleLowerCase();

const reObjectArr = (target, list) => list.reduce((value, keys) => {
  if (target[keys] !== undefined) value[keys] = target[keys];
  return value;
}, {});

function handlerKeys (binding) {
  let types = getType(binding);
  if (['string', 'number'].includes(types)) {
    return handlerKeys({ key: binding });
  }
  if ('object' === types) {
    types = getType(binding['key']);
    if (types === 'string') {
      const keys_map = binding['key'].toLocaleUpperCase();
      if (keys[keys_map]) {
        binding['key'] = keys[keys_map];
      } else if (binding['key'].length === 1) {
        binding['key'] = keys[keys_map].charCodeAt(0);
      } else {
        return false;
      }
    }
  }
  return { ...binding };
}

export const Keyboard = keys;

export const Shortcuts = function(container, options) {
  if (!(this instanceof Shortcuts)) {
    return new Shortcuts(container, options);
  }

  const bindings = {};

  const root = container || document.body;

  const getBindings = (binding, create = false) => {
    let target = bindings;
    for (const k of keyArr) {
      if (binding[k]) {
        if (!target[k]) {
          if (!create) return [];
          target[k] = {};
        }
        target = target[k];
      }
    }
    if (!target[binding['key']] && create) target[binding['key']] = [];
    return target[binding['key']] || [];
  };

  const handlerStart = event => {
    const keys = reObjectArr(event, keyArr);
    keys.key = event.which || event.keyCode;
    getBindings(keys).forEach(({ handler, key }) => handler(key));
  };

  const quit = () => {
    root.removeEventListener('keydown', handlerStart);
  };

  const handlerQuit = () => {
    const remove = root.remove;
    root.remove = () => {
      quit();
      remove();
    };
  };

  handlerQuit();

  const addBinding = (keys, handler) => {
    keys = handlerKeys(keys);
    if (!keys && handler) return false;
    getBindings(keys, true).push({ key: keys, handler });
  };

  const handlerBindings = bindings => {
    for (const binding of bindings) {
      addBinding(reObjectArr(binding, ['key'].concat(keyArr)), binding['handler']);
    }
  };

  options && handlerBindings(options);

  const start = () => {
    root.addEventListener('keydown', handlerStart);
  };

  start();

  return { addBinding, quit, start, bindings };
};

export default Shortcuts;