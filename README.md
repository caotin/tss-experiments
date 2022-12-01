# Generate HEX string out of a message:

Run this command:
```
yarn hexify-string --message "hello world"
```

to produce this output:
```
68656c6c6f20776f726c64
```

# Recover address from the original message and signature:

Run this command:
```
yarn recover-address --message "hello world" -r "..." -s "..." -v [0|1]
```

to produce this output:
```
{ recoveredAddress: '0x6D33805F7878Cc1f33fd804eCae36235db65d7ef' }
```

# Video

https://user-images.githubusercontent.com/60445720/178096544-5e7a59d9-88c2-4748-81e5-652bfe71ad0f.mov

## Transaction
# Generate HEX string out of a transaction:

Run this command:
```
yarn hex-tx
```

to produce this output:
```
0x711da8dca548a4cf3c4ceb1f6e8333ce13fa1e7f2e1d2e64ee97a000e9a241cb
```

remove 0x to signature MPC

# Send transaction and signature to blockchain:

Run this command:
```
yarn send-tx --message "hello world" -r "..." -s "..." -v [0|1]
```

example

```
yarn send-tx --message "711da8dca548a4cf3c4ceb1f6e8333ce13fa1e7f2e1d2e64ee97a000e9a241cb" -r "5a9604ca0b6a03f8b4936bec7756f2379454dd72f14097969a253c5df6421f7a" -s "313068b9107660191d7b901af4bfae41ed76891fa2aefa80eafedc8d24654ae2" -v 1

```

to produce this output:
```
{
  hash: '0xbd4254198c9e1c8e68bf31ca7290f68358edad874dba24a1918d8319c98ed1f0'
}
```

NOTE: the input in hex-tx and send-tx required is the same