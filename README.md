# pinia-decorator-module

Use decorator to write your pinia

### Install

```
// npm
npm install pinia-decorator-module
// yarn
yarn add pinia-decorator-module
```

### Use

You can't use `this` by getters, please use `state`. And you must use it `CreateGetters` wrap, This can make you get true type

#### QA
Q. why default use CreateGetters by @Getters ?
A. lock -> [typescript #4881](https://github.com/microsoft/TypeScript/issues/4881)

```typescript
import { Actions, CreateGetters, Getters, Pinia, Plugins, Store } from "pinia-decorator-module"

@Store("Demo")
class Demo extends Pinia {
  count = 300

  @Getters
  // type conversion
  Count = CreateGetters((state: Demo) => {
    return state.count
  })

  @Getters
  GetCount = CreateGetters((state: Demo) => {
    return () => state.count * 2
  })

  @Getters
  linkCount = CreateGetters((state: Demo) => {
    return state.Count * 2
  })

  @Actions
  addCount() {
    this.count++
  }

  @Plugins
  debounce = {
      addCount: 0
   }
}

export const useDemo = () => new Demo()
```

Just like

```typescript
import { defineStore } from "pinia"

export const useCount = defineStore('count', {
  state: () => {
    return {
      count: 0
    }
  },
  getters: {
    Count(state) {
      return state.count
    },
    GetCount(state) {
      return () => state.count
    },
    linkCount(): number {
      return this.Count * 2
    }
  },
  actions: {
    addCount() {
      this.count++
    }
  },
  debounce: {
    addCount: 300,
  },
})
```
