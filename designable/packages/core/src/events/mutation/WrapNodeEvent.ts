import { ICustomEvent } from '@swiftease/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class WrapNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent {
  type = 'wrap:node'
}
