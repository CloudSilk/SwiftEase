import { uuid } from 'uuidv4';
import Ids from 'ids';
const IDS = new Ids([32, 36, 1]);
export function nextID(prefix?: string, element?: any) {
    return uuid()
}


export function nextShortID(prefix?: string, element?: any) {
    if (prefix) {
        return prefix + IDS.next(element)
    }
    return IDS.next(element)
}

window['nextID'] = nextID
window['nextShortID'] = nextShortID