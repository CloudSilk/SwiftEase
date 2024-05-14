import { ICustomEvent } from '@swiftease/designable-shared'
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent'

export class SwitchWorkspaceEvent
  extends AbstractWorkspaceEvent
  implements ICustomEvent {
  type = 'switch:workspace'
}
