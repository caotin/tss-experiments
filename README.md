# Generate HEX string out of a message:

Run this command:
```
yarn hexify-string --message "hello world"
```

to produce this output:
```
yarn run v1.22.17
$ ts-node src/hexify-string.ts --message 'hello world'
68656c6c6f20776f726c64
✨  Done in 0.63s.
```

# Recover address from the original message and signature:

Run this command:
```
yarn recover-address --message "hello world" -r "..." -s "..." -v [0|1]
```

to produce this output:
```

```