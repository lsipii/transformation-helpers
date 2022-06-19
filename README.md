# transformation-helpers

JavaScript utilities library for transforming objects, arrays, strings etc..

## Install

```Shell
npm install @lsipii/transformation-helpers
```

## Usage examples

domain parser:

```TypeScript
import { parseDomain } from "@lsipii/transformation-helpers/Strings";
parseDomain("https://github.com/lsipii/transformation-helpers")
// --> "github.com"
```

object defaults:

```TypeScript
import { ensureObjectDefaults } from "@lsipii/transformation-helpers/Objects";
ensureObjectDefaults({ data1: "hai" }, { data1: "zebra", data2: "doggie" })
// -->  { data1: hai, data2: doggie }
```

More examples at [test cases folder](./tests).
