import { $gameMessage, Game_Message } from "rmmz"

import { MZFMCommand, PluginCommandDocs } from "@mzfm/common"

interface Choice {
  index: number
  value?: string
}

export interface EditChoicesArgs {
  choices: Choice[]
}

let _cached: Choice[] | null = null
let _indices: number[] | null = null

export const EditChoices: MZFMCommand<EditChoicesArgs> = {
  setGlobal: true,
  initialize: () => {
    const Game_Message_setChoices = Game_Message.prototype.setChoices
    Game_Message.prototype.setChoices = function (
      choices,
      defaultType,
      cancelType
    ) {
      if (_cached) {
        let indices = choices.map((_, i) => i)
        for (const choice of _cached) {
          const { index, value } = choice
          if (index > choices.length) continue
          if (value) {
            choices[index - 1] = value
          } else {
            indices[index - 1] = -1
          }
        }
        _indices = indices.filter((i) => i >= 0)
        choices = _indices.map((i) => choices[i])
        defaultType = _indices.indexOf(defaultType - 1) + 1
        if (cancelType >= 0) {
          cancelType = _indices.indexOf(cancelType)
        }
        _cached = null
      }
      Game_Message_setChoices.call(this, choices, defaultType, cancelType)
    }
    const Game_Interpreter = (window as any).Game_Interpreter
    const Game_Interpreter_setupChoices =
      Game_Interpreter.prototype.setupChoices
    Game_Interpreter.prototype.setupChoices = function (params: unknown[]) {
      Game_Interpreter_setupChoices.call(this, params)
      $gameMessage.setChoiceCallback((n: number) => {
        this._branch[this._indent] = _indices ? _indices[n] : n
        _indices = null
      })
    }
    return true
  },
  run: (args: EditChoicesArgs) => {
    const { choices } = args
    console.debug(`EditChoices:`, choices)
    _cached = !choices || choices.length === 0 ? null : choices
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
