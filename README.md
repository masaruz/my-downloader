# Download Engine

For downloading from multiple sources and protocols

## Getting Started

### Installing Dependencies
```
yarn
```

### How to use
```
yarn start --config=your_path_name
```

### Example Configuration File
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

### Currently Protocols Supported
```
http
https
ftp
sftp
```

### For More Implementation
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


