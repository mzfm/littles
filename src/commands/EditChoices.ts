import { $gameMessage, Game_Interpreter } from "rmmz"

import { MZFMCommand, PluginCommandDocs, overrideMethod, MZFMInterpreter, getContext } from "@mzfm/common"

interface Choice {
  index: number
  value?: string
}

export interface EditChoicesArgs {
  choices: Choice[]
}

export const EditChoices: MZFMCommand<EditChoicesArgs, EditChoicesArgs> = {
  setGlobal: true,
  initialize: (commandName: string) => {
    overrideMethod(
      Game_Interpreter,
      "setup",
      function (this: MZFMInterpreter, original, list, eventId) {
        original.call(this, list, eventId)
        const ctx = getContext<EditChoicesArgs>(this, commandName)
        ctx.choices = undefined
      }
    )
    overrideMethod(Game_Interpreter, "setupChoices", function (this: MZFMInterpreter, _, params) {
      let choices = params[0].clone()
      let indices = choices.map((_, i) => i)
      let cancelType = params[1] < choices.length ? params[1] : -2
      let defaultType = params.length > 2 ? params[2] : 0
      const positionType = params.length > 3 ? params[3] : 2
      const background = params.length > 4 ? params[4] : 0
      const ctx = getContext<EditChoicesArgs>(this, commandName)
      if (ctx.choices) {
        for (const choice of ctx.choices) {
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
        ctx.choices = undefined
      }

      choices = indices.map((i) => choices[i])
      $gameMessage.setChoices(choices, defaultType, cancelType)
      $gameMessage.setChoiceBackground(background)
      $gameMessage.setChoicePositionType(positionType)
      $gameMessage.setChoiceCallback((n: number) => {
        this._branch[this._indent] = indices[n]
      })
    })
    return true
  },
  run: function (this: MZFMInterpreter, ctx, args) {
    const { choices } = args
    console.debug(`EditChoices:`, choices)
    if (!choices || choices.length === 0) {
      ctx.choices = undefined
    } else {
      ctx.choices = choices
    }
  },
}

export const DOCS: PluginCommandDocs<typeof EditChoices> = {
  description: "Modify one or more choices for the next question. Will replace unused `EditChoices`.",
  args: {
    choices: {
      text: "Choices",
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
