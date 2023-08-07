import { defineStore, Store as PiniaStore } from "pinia";

const PropertyPlugins = '__plugins__'
const PropertyActions = '__actions__'
const PropertyGetters = '__getters__'

function storeFactory<C extends S>(Store: C, name?: string) {
  const proto = Store.prototype;

  const pluginKeys = proto[PropertyPlugins] || []
  const getterKeys = proto[PropertyGetters] || []

  const states: Record<string, any> = {}
  const getters: Record<string, (state: S) => any> = {}
  const plugins: Record<string, any> = {}

  const data = new Store()

  Object.keys(data).forEach((key) => {
    if (pluginKeys.includes(key)) {
      plugins[key] = data[key]
    }
    else if (getterKeys.includes(key)) {
      getters[key] = data[key]
    }
    else {
      states[key] = data[key]
    }
  })

  const options = { getters }

  Object.assign(options, {
    state: () => JSON.parse(JSON.stringify(states)),
    actions: { ...proto[PropertyActions] },
    hydrate: proto['hydrate'],
    ...plugins
  })

  const storeName = name || Store.name

  const useStore = defineStore(storeName, options);

  return function () {
    return useStore();
  };
}

type S = new () => any;

export function Store(name: string): <C extends S>(target: C) => C;
export function Store<C extends S>(target: C): C;
export function Store<C extends S>(name?: string) {
  return function (Store: C) {
    return storeFactory(Store, name);
  };
}


const defineProperty = (target: any, key: string, defaultValue: any) => {
  Object.defineProperty(target, key, {
    value: defaultValue,
    enumerable: true,
    configurable: true,
  });
}

export function Actions(target: any, key: string, decorator: TypedPropertyDescriptor<any>) {
  if (!target[PropertyActions]) {
    defineProperty(target, PropertyActions, {})
  }

  target[PropertyActions][key] = decorator.value
}

// CreateGetters: type conversion
// count: (state) => state.count // number   ----->  count: number 
export function CreateGetters<T, K>(GetterFunction: (state: K) => T) {
  return GetterFunction as T
}

// why default use CreateGetters? ----> https://github.com/microsoft/TypeScript/issues/4881
export function Getters(target: any, key: string) {
  if (!target[PropertyGetters]) {
    defineProperty(target, PropertyGetters, [])
  }

  target[PropertyGetters].push(key)
}

export function Plugins(target: any, key: string) {
  if (!target[PropertyPlugins]) {
    defineProperty(target, PropertyPlugins, [])
  }

  target[PropertyPlugins].push(key)
}

export const Pinia = function () { } as unknown as new () => PiniaStore;