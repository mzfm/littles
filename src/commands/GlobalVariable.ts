import { docs, MZFM, getGlobal, MZFMCommand, setGlobal, PluginCommandDocs, getGlobalSync } from "@mzfm/common"
import { getParams, LittleFeatureDocs } from "../types"

const PARAMS_KEY = "GlobalVariable"

export interface GlobalVariableParams {
  namespace: string
}

export interface GlobalVariableArgs {
  key: string
  type: "string" | "number" | "boolean"
  s?: string
  n?: number
  b?: boolean
}

export const GlobalVariable: MZFMCommand<GlobalVariableArgs> = {
  initialize: async () => {
    const { namespace } = getParams(PARAMS_KEY)
    MZFM.global = (key: string) => getGlobalSync(key, namespace)
    MZFM.setGlobal = setGlobal
    // get a arbitrary variable to update the globals
    await getGlobal("mzfm", { namespace })
  },
  run: async (args) => {
    const { namespace } = getParams(PARAMS_KEY)
    const { key } = args
    const value = args.type === "string" ? args.s : args.type === "number" ? args.n : args.b
    await setGlobal(key, value, { namespace })
  },
}

export const DOCS_PARAMS: LittleFeatureDocs<GlobalVariableParams> = {
  key: PARAMS_KEY,
  title: "",
  params: {
    namespace: {
      text: "Namespace",
      description: "The namespace of the global variables",
      default: "mzfm_globals",
      type: String,
    },
  },
}

export const DOCS: PluginCommandDocs<typeof GlobalVariable> = {
  description: "Set a global variable. Make sure type and value are consistent.",
  args: {
    key: { ...docs("Key", "The key of the global variable."), required: true },
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
    s: docs("String value", "A string to be set as the value"),
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
