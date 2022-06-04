import { MZFMPlugin } from "@mzfm/common"
import { EditChoices } from "./commands/EditChoices"

const PARAMS = {}
const COMMANDS = {
  EditChoices,
}
export const PLUGIN: MZFMPlugin<typeof PARAMS, typeof COMMANDS> = {
  name: "MZFM_Littles",
  params: PARAMS,
  commands: COMMANDS,
}
