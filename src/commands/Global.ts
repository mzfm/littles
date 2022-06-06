import { MZFM, getGlobal, MZFMCommand, setGlobal, PluginCommandDocs, getGlobalSync } from "@mzfm/common"

export interface GlobalArgs {
  key: string
  type: "string" | "number" | "boolean"
  s?: string
  n?: number
  b?: boolean
}

export const Global: MZFMCommand<GlobalArgs> = {
  initialize: async () => {
    MZFM.global = getGlobalSync
    MZFM.setGlobal = getGlobal
    // get a arbitrary variable to update the globals
    await getGlobal("mzfm")
  },
  run: (args) => {
    const { key } = args
    const value = args.type === "string" ? args.s : args.type === "number" ? args.n : args.b
    setGlobal(key, value)
  },
}

export const DOCS: PluginCommandDocs<typeof Global> = {
  description: "Set a global variable. Make sure type and value are consistent.",
  args: {
    key: {
      text: "Key",
      description: "The key of the global variable.",
      required: true,
      type: String,
    },
    type: {
      text: "Type",
      description: "The type of the global variable.",
      required: true,
      default: "boolean",
      options: [
        { text: "String", value: "string" },
        { text: "Number", value: "number" },
        { text: "Boolean", value: "boolean" },
      ],
      type: "select",
    },
    s: {
      text: "String value",
      description: "A string to be set as the value",
      default: "",
      type: String,
    },
    n: {
      text: "Number value",
      description: "A number to be set as the value",
      default: 0,
      type: Number,
    },
    b: {
      text: "Boolean value",
      description: "A boolean to be set as the value",
      default: true,
      type: Boolean,
    },
  },
}
