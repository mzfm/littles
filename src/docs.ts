import { PluginDocs } from "@mzfm/common"
import { PLUGIN } from "./plugin"
import packageConfig from "../package.json"
import { DOCS as EditChoices } from "./commands/edit-choices"

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
  params: {},
  commands: {
    EditChoices,
  },
  helpText,
  copyright,
} as PluginDocs<typeof PLUGIN>
