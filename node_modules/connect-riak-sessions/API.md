  - [Store](#store)
  - [RiakStore()](#riakstore)
  - [RiakStore.prototype.__proto__](#riakstoreprototype__proto__)
  - [RiakStore.get()](#riakstoregetsidstringfnfunction)
  - [RiakStore.set()](#riakstoresetsidstringsesssessionfnfunction)
  - [RiakStore.destroy()](#riakstoredestroysidstring)

## Store

  Connect's Store.

## RiakStore()

  Initialize RiakStore with the given `options`.

## RiakStore.prototype.__proto__

  Inherit from `Store`.

## RiakStore.get(sid:String, fn:Function)

  Attempt to fetch session by the given `sid`.

## RiakStore.set(sid:String, sess:Session, fn:Function)

  Commit the given `sess` object associated with the given `sid`.

## RiakStore.destroy(sid:String)

  Destroy the session associated with the given `sid`.
