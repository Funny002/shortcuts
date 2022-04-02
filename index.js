'use script';
const keyArr = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'];

const keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, ESCAPE: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46 };

const getType = target => Object.prototype.toString.call(target).slice(8, -1).toLocaleLowerCase();

const reObjectArr = (target, list) => list.reduce((value, keys) => (value[keys] = target[keys], value), {});

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

const Shortcuts = (container, options) => {
  if (this instanceof Shortcuts) {
    return new Shortcuts(container, options);
  }

  const bindings = {};

  const root = container || document.body;

  const getBindings = binding => {
    let target = bindings;
    for (const k of keyArr) {
      if (binding[k]) {
        if (!target[k]) target[k] = {};
        target = target[k];
      }
    }
    return target;
  };

  const handlerListen = event => {
    const obj = reObjectArr(event, ['which', 'code'].concat(keyArr));
    console.log(obj, event);
  };

  const uninstall = () => {
    root.removeEventListener('keydown', handlerListen);
  };

  const handlerUninstall = () => {
    const remove = root.remove;
    root.remove = () => {
      uninstall();
      remove();
    };
  };

  handlerUninstall();

  const addBinding = (keys, handler) => {
    keys = handlerKeys(keys);
    if (!keys && handler) return false;
    const bindings = getBindings(keys);
    if (!bindings[keys['key']]) bindings[keys['key']] = [];
    bindings[keys['key']].push({ key: keys, handler });
  };

  const handlerBindings = bindings => {
    for (const binding of bindings) {
      addBinding(reObjectArr(binding, ['key'].concat(keyArr)), binding['handler']);
    }
  };

  options && handlerBindings(options);

  const listen = () => {
    root.addEventListener('keydown', handlerListen);
  };

  listen();

  return { addBinding, uninstall, listen, bindings };
};
