# Download Engine

For downloading from multiple sources and protocols

## Getting Started

### Installing dependencies
```
yarn
```

### How to use
```
yarn start --config=your_path_name
```

### Example configuration file
```
[
  {
    "url": "https://example.com/file.ext",
    "dir": "your_local_pathname"
  },
  {
    "url": "http://example.com/file.ext",
    "dir": "your_local_pathname"
  },
  {
    "url": "ftp://example.com/file.ext",
    "dir": "your_local_pathname"
  },
  {
    "url": "ftp://example.com/file.ext",
    "username": "username",
    "password": "password",
    "dir": "your_local_pathname"
  },
  {
    "url": "sftp://example.com/file.ext",
    "username": "username",
    "password": "password",
    "dir": "your_local_pathname"
  }
]
```

### Currently protocols supported
```
http
https
ftp
sftp
```

### For more conribute more protocol
```
src/
  |
  |- modules
      |- example
      |
      |- your_new_module      // see in example module
      |       |- index.ts     // extends base.ts
      |       |- factory.ts
      |
      |
      |- base.ts
      |- index.ts             // include your factory
```

## Test
### Some of tests might be faild because of network or endpoint of file has been changed 
```
yarn test  
yarn test:ci
```
