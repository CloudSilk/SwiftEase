import { GlobalRegistry, IDesignerRegistry } from '@swiftease/designable-core'
import { globalThisPolyfill } from '@swiftease/designable-shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
