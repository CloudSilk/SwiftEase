import { parse, stringify } from 'query-string';

export function replaceTakeRedirect(history: any, path: string, loginPath: string) {
    const { search, pathname } = history.location;
    const query = parse(search);
    const { redirect } = query;
    if (window.location.pathname !== loginPath && !redirect) {
        history.replace({
            pathname: path,
            search: stringify({
                redirect: pathname,
                params: stringify(query)
            }),
        });
    }
}

export function pushWithRedirect(history: any) {
    const query = parse(history.location.search);
    const { redirect, params } = query as { redirect: string, params: string };
    let path = redirect
    if (path && path !== "") {
        path += "?"
    }
    if (params && params !== "") {
        path += params
    }
    history.push(path || '/');
}

export function getSearchParams() {
    var search = ""
    var searchArray = location.hash.split("?")
    if (searchArray.length == 2) {
        search = searchArray[1]
    }
   return parse(search);
}