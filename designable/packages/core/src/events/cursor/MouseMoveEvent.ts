import { ICustomEvent } from '@swiftease/designable-shared'
import { AbstractCursorEvent } from './AbstractCursorEvent'

export class MouseMoveEvent
  extends AbstractCursorEvent
  implements ICustomEvent {
  type = 'mouse:move'
}
