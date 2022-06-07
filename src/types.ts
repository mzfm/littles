import { PluginDocsParameter } from "@mzfm/common"
import { FEATURES, PLUGIN } from "./plugin"

export interface LittleParams {
  enabled: boolean
}

export interface LittleFeature<T extends LittleParams> {
  start: (params: T) => void | Promise<void>
}

export interface LittleFeatureDocs<T> {
  key: string
  title?: string
  description?: string
  params: {
    [key in Exclude<keyof T, "enabled">]: PluginDocsParameter<T[key]>
  }
}

type ExtractParamType<T> = T extends LittleFeature<infer P> ? P : never

const _cachedParams = {} as Record<string, unknown>
export const getParams = <T extends keyof typeof FEATURES>(
  namespace: T
): ExtractParamType<typeof FEATURES[T]> => {
  if (_cachedParams[namespace]) {
    return _cachedParams[namespace] as ExtractParamType<typeof FEATURES[T]>
  }
  const { params } = PLUGIN
  const prefix = `:${namespace}:`
  const result = (_cachedParams[namespace] = {} as ExtractParamType<typeof FEATURES[T]>)
  for (const key in params) {
    if (key.startsWith(prefix)) {
      const name = key.substring(prefix.length) as keyof ExtractParamType<typeof FEATURES[T]>
      result[name] = params[key] as ExtractParamType<typeof FEATURES[T]>[typeof name]
    }
  }
  return result
}

export const makeParamDocs = <T>(
  docs: LittleFeatureDocs<T>
): Record<string, PluginDocsParameter<unknown>> => {
  const { key, title, description, params } = docs
  const result = {} as Record<string, PluginDocsParameter<unknown>>
  const parentKey = title ? `:${key}:enabled` : undefined
  if (parentKey) {
    result[parentKey] = {
      text: title,
      description,
      default: "Enabled",
      type: "select",
      options: ["Enabled", "Disabled"],
    }
  }
  for (const key2 in params) {
    const paramKey = `:${key}:${key2}`
    const param = params[key2 as keyof typeof params]
    param.parent = parentKey
    result[paramKey] = param
  }
  return result
}
