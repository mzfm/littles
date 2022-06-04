import { MZFMPlugin } from "@mzfm/common"
import { EditChoices } from "./commands/edit-choices"

const PARAMS = {}
const COMMANDS = {
  EditChoices,
}
export const PLUGIN: MZFMPlugin<typeof PARAMS, typeof COMMANDS> = {
  name: "MZFM_Littles",
  params: PARAMS,
  commands: COMMANDS,
}
