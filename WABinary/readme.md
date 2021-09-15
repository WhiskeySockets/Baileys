# WABinary

Contains the raw JS code to parse WA binary messages. WA uses a tree like structure to encode information, the type for which is written below:

``` ts
export type BinaryNode = {
    tag: string
    attrs: Attributes
	content?: BinaryNode[] | string | Uint8Array
}
```

Do note, the multi-device binary format is very similar to the one on WA Web, though they are not backwards compatible.

Originally from [pokearaujo/multidevice](https://github.com/pokearaujo/multidevice)