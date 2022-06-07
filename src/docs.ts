import { PluginDocs } from "@mzfm/common"
import { DOCS as EditChoices } from "./commands/EditChoices"
import { DOCS as GlobalVariable, DOCS_PARAMS as GlobalVariableParam } from "./commands/GlobalVariable"
import { DOCS as RandomTitleImage } from "./features/RandomTitleImage"
import { PLUGIN } from "./plugin"
import packageConfig from "../package.json"
import { makeParamDocs } from "./types"

const { name: projectName, author, description, version } = packageConfig

const copyright = `
Copyright (c) ${new Date().getFullYear()} Vilja <i@vilja.me>

License: The MIT License.
`
const helpText = ""

export default {
  name: PLUGIN.name,
  projectName,
  author,
  version,
  title: "MZFM Littles",
  targets: ["MZ"],
  description,
  url: "https://github.com/mzfm/littles",
  params: {
    ...makeParamDocs(GlobalVariableParam),
    ...makeParamDocs(RandomTitleImage),
  },
  commands: {
    EditChoices,
    GlobalVariable,
  },
  helpText,
  copyright,
} as PluginDocs<typeof PLUGIN>
