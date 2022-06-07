import { MZFMPlugin } from "@mzfm/common"
import { EditChoices } from "./commands/EditChoices"
import { GlobalVariable } from "./commands/GlobalVariable"
import { RandomTitleImage } from "./features/RandomTitleImage"
import { getParams } from "./types"

const COMMANDS = {
  EditChoices,
  GlobalVariable,
}

export const FEATURES = {
  RandomTitleImage,
  EditChoices,
  GlobalVariable,
}

const initialize = async () => {
  let key: keyof typeof FEATURES
  for (key in FEATURES) {
    const feature = FEATURES[key]
    if ("start" in feature) {
      const params = getParams(key)
      await feature.start(params)
    }
  }
}

export const PLUGIN = new MZFMPlugin<Record<string, unknown>, typeof COMMANDS>(
  "MZFM_Littles",
  COMMANDS,
  initialize
)
