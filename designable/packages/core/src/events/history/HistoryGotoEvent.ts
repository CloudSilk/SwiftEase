import { ICustomEvent } from '@swiftease/designable-shared'
import { AbstractHistoryEvent } from './AbstractHistoryEvent'

export class HistoryGotoEvent
  extends AbstractHistoryEvent
  implements ICustomEvent {
  type = 'history:goto'
}
