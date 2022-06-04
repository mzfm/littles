import { $gameMessage, Game_Message } from "rmmz"

import { MZFMCommand, PluginCommandDocs } from "@mzfm/common"
import { $dataMap } from "rmmz"
import { RPG } from "rmmz"
import { overrideMethod } from "@mzfm/common"

interface Choice {
  index: number
  value?: string
}

export interface EditChoicesArgs {
  choices: Choice[]
}

export const EditChoices: MZFMCommand<EditChoicesArgs> = {
  setGlobal: true,
  initialize: () => {
    const Game_Interpreter = (window as any).Game_Interpreter

    overrideMethod(
      Game_Interpreter,
      "setup",
      function (this: any, original: any, list: unknown[], eventId: number) {
        original.call(this, list, eventId)
        this._editChoices = undefined
      }
    )
    overrideMethod(
      Game_Interpreter,
      "setupChoices",
      function (
        this: any,
        _: any,
        params: [string[], number, number, number, number]
      ) {
        let choices = params[0]
        let indices = choices.map((_, i) => i)
        let cancelType = params[1] < choices.length ? params[1] : -2
        let defaultType = params.length > 2 ? params[2] : 0
        const positionType = params.length > 3 ? params[3] : 2
        const background = params.length > 4 ? params[4] : 0
        if (this._editChoices) {
          for (const choice of this._editChoices) {
            const { index, value } = choice
            if (index > choices.length) continue
            if (value) {
              choices[index - 1] = value
            } else {
              indices[index - 1] = -1
            }
          }
          indices = indices.filter((i) => i >= 0)
          defaultType = indices.indexOf(defaultType - 1) + 1
          if (cancelType >= 0) {
            cancelType = indices.indexOf(cancelType)
          }
          this._editChoices = undefined
        }

        choices = indices.map((i) => choices[i])
        $gameMessage.setChoices(choices, defaultType, cancelType)
        $gameMessage.setChoiceBackground(background)
        $gameMessage.setChoicePositionType(positionType)
        $gameMessage.setChoiceCallback((n: number) => {
          this._branch[this._indent] = indices[n]
        })
      }
    )
    return true
  },
  run: function (this: any, args: EditChoicesArgs) {
    const { choices } = args
    console.debug(`EditChoices:`, choices)
    if (!choices || choices.length === 0) {
      this._editChoices = undefined
    } else {
      this._editChoices = choices
    }
  },
}

export const DOCS: PluginCommandDocs<typeof EditChoices> = {
  description:
    "Modify one or more choices for the next question. Will replace unused `EditChoices`.",
  args: {
    choices: {
      text: "Choices to edit",
      description: "The choices to edit. Indices are 1-based.",
      default: [],
      type: [
        {
          key: "Choice",
          fields: {
            index: {
              type: Number,
              required: true,
            },
            value: {
              type: String,
            },
          },
        },
      ],
    },
  },
}
