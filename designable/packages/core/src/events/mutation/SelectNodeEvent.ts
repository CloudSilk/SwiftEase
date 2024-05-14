import { ICustomEvent } from '@swiftease/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class SelectNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent {
  type = 'select:node'
}
