import { ImageManager, Scene_Title, Sprite } from "rmmz"
import { docs, globalEval, overrideMethod } from "@mzfm/common"
import { LittleFeature, LittleFeatureDocs, LittleParams } from "../types"

const PARAMS_KEY = "RandomTitleImage"

interface ImageFile {
  name: string
  condition?: string
  offsetX?: number
  offsetY?: number
}

export interface RandomTitleImageParams extends LittleParams {
  files: ImageFile[]
}

export const RandomTitleImage: LittleFeature<RandomTitleImageParams> = {
  start: (params: RandomTitleImageParams) => {
    const { files } = params
    overrideMethod(Scene_Title, "create", function (this, f) {
      f()
      const filtered = files
        .map((file) => {
          const { condition } = file
          if (typeof condition === "string" && condition.length > 0) {
            return globalEval(condition) ? file : undefined
          }
          return file
        })
        .filter((x) => x) as ImageFile[]
      const file = filtered[Math.floor(Math.random() * filtered.length)]
      const { name, offsetX, offsetY } = file
      console.debug(`Set title image: ${name}`)
      const background = new Sprite(ImageManager.loadBitmap("img/", name))
      background.x = offsetX || 0
      background.y = offsetY || 0
      this.addChildAt(background, 1)
    })
  },
}

export const DOCS: LittleFeatureDocs<RandomTitleImageParams> = {
  key: PARAMS_KEY,
  title: "Random Title Image",
  description: "Randomly change the title image.",
  params: {
    files: {
      text: "Image Files",
      description: "The image files to use.",
      type: [
        {
          key: "RandomImageFile",
          fields: {
            name: {
              text: "Name",
              description: "The filename of the image.",
              required: true,
              type: "file",
              dir: "img/",
            },
            condition: docs(
              "Condition",
              "Condition when the file is included. " +
                "Leave blank to always include it. " +
                "Please keep the condition as clean as possible."
            ),
            offsetX: {
              text: "Offset X",
              description: "The x offset of the image.",
              default: 0,
              type: Number,
            },
            offsetY: {
              text: "Offset Y",
              description: "The y offset of the image.",
              default: 0,
              type: Number,
            },
          },
        },
      ],
    },
  },
}
