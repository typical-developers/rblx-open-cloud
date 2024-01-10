import { Entry } from "./default";

export interface ListEntries {
    /** The Entries from the specified Scope. */
    entries: Entry[],
    /** A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
    nextPageCursor: string
}

export interface ListOptionalParams {
    /** The range of qualifying values of entries to return. */
    filter?: string,
    /** The enumeration direction. The order by default is ascending. Input a desc suffix for descending. */
    order_by?: "desc",
    /** The maximum number of entries to return. The service may return fewer than this value. The default value is `10`. The maximum value is `100`, and any input above `100` is coerced to `100`. */
    max_page_size?: number,
    /** A page token received from a previous `List` call. */
    page_token?: string
}

