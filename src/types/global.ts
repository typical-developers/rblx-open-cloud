export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface BaseDatastoreContext {
    apiKey: string;
    universeId: number;
}
