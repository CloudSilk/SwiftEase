import { ICustomEvent } from '@swiftease/designable-shared'
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent'
export class AddWorkspaceEvent
  extends AbstractWorkspaceEvent
  implements ICustomEvent {
  type = 'add:workspace'
}
