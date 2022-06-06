import { MZFMPlugin } from "@mzfm/common"
import { EditChoices } from "./commands/EditChoices"
import { Global } from "./commands/Global"

const DEFAULT_PARAMS = {}
const COMMANDS = {
  EditChoices,
  Global,
}
export const PLUGIN: MZFMPlugin<typeof DEFAULT_PARAMS, typeof COMMANDS> = {
  name: "MZFM_Littles",
  default_params: DEFAULT_PARAMS,
  commands: COMMANDS,
}
