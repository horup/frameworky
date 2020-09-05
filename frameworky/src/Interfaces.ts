export interface Serializable<T>
{
    serialize<T>(s:WritableStream, base?:T);
    deserialize(s:ReadableStream);
}

export interface Clonable<T>
{
    cloneFrom(source:T);
}