var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/adm-zip/util/constants.js
var require_constants = __commonJS({
  "node_modules/adm-zip/util/constants.js"(exports2, module2) {
    module2.exports = {
      /* The local file header */
      LOCHDR: 30,
      // LOC header size
      LOCSIG: 67324752,
      // "PK\003\004"
      LOCVER: 4,
      // version needed to extract
      LOCFLG: 6,
      // general purpose bit flag
      LOCHOW: 8,
      // compression method
      LOCTIM: 10,
      // modification time (2 bytes time, 2 bytes date)
      LOCCRC: 14,
      // uncompressed file crc-32 value
      LOCSIZ: 18,
      // compressed size
      LOCLEN: 22,
      // uncompressed size
      LOCNAM: 26,
      // filename length
      LOCEXT: 28,
      // extra field length
      /* The Data descriptor */
      EXTSIG: 134695760,
      // "PK\007\008"
      EXTHDR: 16,
      // EXT header size
      EXTCRC: 4,
      // uncompressed file crc-32 value
      EXTSIZ: 8,
      // compressed size
      EXTLEN: 12,
      // uncompressed size
      /* The central directory file header */
      CENHDR: 46,
      // CEN header size
      CENSIG: 33639248,
      // "PK\001\002"
      CENVEM: 4,
      // version made by
      CENVER: 6,
      // version needed to extract
      CENFLG: 8,
      // encrypt, decrypt flags
      CENHOW: 10,
      // compression method
      CENTIM: 12,
      // modification time (2 bytes time, 2 bytes date)
      CENCRC: 16,
      // uncompressed file crc-32 value
      CENSIZ: 20,
      // compressed size
      CENLEN: 24,
      // uncompressed size
      CENNAM: 28,
      // filename length
      CENEXT: 30,
      // extra field length
      CENCOM: 32,
      // file comment length
      CENDSK: 34,
      // volume number start
      CENATT: 36,
      // internal file attributes
      CENATX: 38,
      // external file attributes (host system dependent)
      CENOFF: 42,
      // LOC header offset
      /* The entries in the end of central directory */
      ENDHDR: 22,
      // END header size
      ENDSIG: 101010256,
      // "PK\005\006"
      ENDSUB: 8,
      // number of entries on this disk
      ENDTOT: 10,
      // total number of entries
      ENDSIZ: 12,
      // central directory size in bytes
      ENDOFF: 16,
      // offset of first CEN header
      ENDCOM: 20,
      // zip file comment length
      END64HDR: 20,
      // zip64 END header size
      END64SIG: 117853008,
      // zip64 Locator signature, "PK\006\007"
      END64START: 4,
      // number of the disk with the start of the zip64
      END64OFF: 8,
      // relative offset of the zip64 end of central directory
      END64NUMDISKS: 16,
      // total number of disks
      ZIP64SIG: 101075792,
      // zip64 signature, "PK\006\006"
      ZIP64HDR: 56,
      // zip64 record minimum size
      ZIP64LEAD: 12,
      // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
      ZIP64SIZE: 4,
      // zip64 size of the central directory record
      ZIP64VEM: 12,
      // zip64 version made by
      ZIP64VER: 14,
      // zip64 version needed to extract
      ZIP64DSK: 16,
      // zip64 number of this disk
      ZIP64DSKDIR: 20,
      // number of the disk with the start of the record directory
      ZIP64SUB: 24,
      // number of entries on this disk
      ZIP64TOT: 32,
      // total number of entries
      ZIP64SIZB: 40,
      // zip64 central directory size in bytes
      ZIP64OFF: 48,
      // offset of start of central directory with respect to the starting disk number
      ZIP64EXTRA: 56,
      // extensible data sector
      /* Compression methods */
      STORED: 0,
      // no compression
      SHRUNK: 1,
      // shrunk
      REDUCED1: 2,
      // reduced with compression factor 1
      REDUCED2: 3,
      // reduced with compression factor 2
      REDUCED3: 4,
      // reduced with compression factor 3
      REDUCED4: 5,
      // reduced with compression factor 4
      IMPLODED: 6,
      // imploded
      // 7 reserved for Tokenizing compression algorithm
      DEFLATED: 8,
      // deflated
      ENHANCED_DEFLATED: 9,
      // enhanced deflated
      PKWARE: 10,
      // PKWare DCL imploded
      // 11 reserved by PKWARE
      BZIP2: 12,
      //  compressed using BZIP2
      // 13 reserved by PKWARE
      LZMA: 14,
      // LZMA
      // 15-17 reserved by PKWARE
      IBM_TERSE: 18,
      // compressed using IBM TERSE
      IBM_LZ77: 19,
      // IBM LZ77 z
      AES_ENCRYPT: 99,
      // WinZIP AES encryption method
      /* General purpose bit flag */
      // values can obtained with expression 2**bitnr
      FLG_ENC: 1,
      // Bit 0: encrypted file
      FLG_COMP1: 2,
      // Bit 1, compression option
      FLG_COMP2: 4,
      // Bit 2, compression option
      FLG_DESC: 8,
      // Bit 3, data descriptor
      FLG_ENH: 16,
      // Bit 4, enhanced deflating
      FLG_PATCH: 32,
      // Bit 5, indicates that the file is compressed patched data.
      FLG_STR: 64,
      // Bit 6, strong encryption (patented)
      // Bits 7-10: Currently unused.
      FLG_EFS: 2048,
      // Bit 11: Language encoding flag (EFS)
      // Bit 12: Reserved by PKWARE for enhanced compression.
      // Bit 13: encrypted the Central Directory (patented).
      // Bits 14-15: Reserved by PKWARE.
      FLG_MSK: 4096,
      // mask header values
      /* Load type */
      FILE: 2,
      BUFFER: 1,
      NONE: 0,
      /* 4.5 Extensible data fields */
      EF_ID: 0,
      EF_SIZE: 2,
      /* Header IDs */
      ID_ZIP64: 1,
      ID_AVINFO: 7,
      ID_PFS: 8,
      ID_OS2: 9,
      ID_NTFS: 10,
      ID_OPENVMS: 12,
      ID_UNIX: 13,
      ID_FORK: 14,
      ID_PATCH: 15,
      ID_X509_PKCS7: 20,
      ID_X509_CERTID_F: 21,
      ID_X509_CERTID_C: 22,
      ID_STRONGENC: 23,
      ID_RECORD_MGT: 24,
      ID_X509_PKCS7_RL: 25,
      ID_IBM1: 101,
      ID_IBM2: 102,
      ID_POSZIP: 18064,
      EF_ZIP64_OR_32: 4294967295,
      EF_ZIP64_OR_16: 65535,
      EF_ZIP64_SUNCOMP: 0,
      EF_ZIP64_SCOMP: 8,
      EF_ZIP64_RHO: 16,
      EF_ZIP64_DSN: 24
    };
  }
});

// node_modules/adm-zip/util/errors.js
var require_errors = __commonJS({
  "node_modules/adm-zip/util/errors.js"(exports2) {
    var errors = {
      /* Header error messages */
      INVALID_LOC: "Invalid LOC header (bad signature)",
      INVALID_CEN: "Invalid CEN header (bad signature)",
      INVALID_END: "Invalid END header (bad signature)",
      /* Descriptor */
      DESCRIPTOR_NOT_EXIST: "No descriptor present",
      DESCRIPTOR_UNKNOWN: "Unknown descriptor format",
      DESCRIPTOR_FAULTY: "Descriptor data is malformed",
      /* ZipEntry error messages*/
      NO_DATA: "Nothing to decompress",
      BAD_CRC: "CRC32 checksum failed {0}",
      FILE_IN_THE_WAY: "There is a file in the way: {0}",
      UNKNOWN_METHOD: "Invalid/unsupported compression method",
      /* Inflater error messages */
      AVAIL_DATA: "inflate::Available inflate data did not terminate",
      INVALID_DISTANCE: "inflate::Invalid literal/length or distance code in fixed or dynamic block",
      TO_MANY_CODES: "inflate::Dynamic block code description: too many length or distance codes",
      INVALID_REPEAT_LEN: "inflate::Dynamic block code description: repeat more than specified lengths",
      INVALID_REPEAT_FIRST: "inflate::Dynamic block code description: repeat lengths with no first length",
      INCOMPLETE_CODES: "inflate::Dynamic block code description: code lengths codes incomplete",
      INVALID_DYN_DISTANCE: "inflate::Dynamic block code description: invalid distance code lengths",
      INVALID_CODES_LEN: "inflate::Dynamic block code description: invalid literal/length code lengths",
      INVALID_STORE_BLOCK: "inflate::Stored block length did not match one's complement",
      INVALID_BLOCK_TYPE: "inflate::Invalid block type (type == 3)",
      /* ADM-ZIP error messages */
      CANT_EXTRACT_FILE: "Could not extract the file",
      CANT_OVERRIDE: "Target file already exists",
      DISK_ENTRY_TOO_LARGE: "Number of disk entries is too large",
      NO_ZIP: "No zip file was loaded",
      NO_ENTRY: "Entry doesn't exist",
      DIRECTORY_CONTENT_ERROR: "A directory cannot have content",
      FILE_NOT_FOUND: 'File not found: "{0}"',
      NOT_IMPLEMENTED: "Not implemented",
      INVALID_FILENAME: "Invalid filename",
      INVALID_FORMAT: "Invalid or unsupported zip format. No END header found",
      INVALID_PASS_PARAM: "Incompatible password parameter",
      WRONG_PASSWORD: "Wrong Password",
      /* ADM-ZIP */
      COMMENT_TOO_LONG: "Comment is too long",
      // Comment can be max 65535 bytes long (NOTE: some non-US characters may take more space)
      EXTRA_FIELD_PARSE_ERROR: "Extra field parsing error"
    };
    function E(message) {
      return function(...args) {
        if (args.length) {
          message = message.replace(/\{(\d)\}/g, (_, n) => args[n] || "");
        }
        return new Error("ADM-ZIP: " + message);
      };
    }
    for (const msg of Object.keys(errors)) {
      exports2[msg] = E(errors[msg]);
    }
  }
});

// node_modules/adm-zip/util/utils.js
var require_utils = __commonJS({
  "node_modules/adm-zip/util/utils.js"(exports2, module2) {
    var fsystem = require("fs");
    var pth = require("path");
    var Constants = require_constants();
    var Errors = require_errors();
    var isWin = typeof process === "object" && "win32" === process.platform;
    var is_Obj = (obj) => typeof obj === "object" && obj !== null;
    var crcTable = new Uint32Array(256).map((t, c) => {
      for (let k = 0; k < 8; k++) {
        if ((c & 1) !== 0) {
          c = 3988292384 ^ c >>> 1;
        } else {
          c >>>= 1;
        }
      }
      return c >>> 0;
    });
    function Utils(opts) {
      this.sep = pth.sep;
      this.fs = fsystem;
      if (is_Obj(opts)) {
        if (is_Obj(opts.fs) && typeof opts.fs.statSync === "function") {
          this.fs = opts.fs;
        }
      }
    }
    module2.exports = Utils;
    Utils.prototype.makeDir = function(folder) {
      const self = this;
      function mkdirSync(fpath) {
        let resolvedPath = fpath.split(self.sep)[0];
        fpath.split(self.sep).forEach(function(name) {
          if (!name || name.substr(-1, 1) === ":") return;
          resolvedPath += self.sep + name;
          var stat;
          try {
            stat = self.fs.statSync(resolvedPath);
          } catch (e) {
            self.fs.mkdirSync(resolvedPath);
          }
          if (stat && stat.isFile()) throw Errors.FILE_IN_THE_WAY(`"${resolvedPath}"`);
        });
      }
      mkdirSync(folder);
    };
    Utils.prototype.writeFileTo = function(path6, content, overwrite, attr) {
      const self = this;
      if (self.fs.existsSync(path6)) {
        if (!overwrite) return false;
        var stat = self.fs.statSync(path6);
        if (stat.isDirectory()) {
          return false;
        }
      }
      var folder = pth.dirname(path6);
      if (!self.fs.existsSync(folder)) {
        self.makeDir(folder);
      }
      var fd;
      try {
        fd = self.fs.openSync(path6, "w", 438);
      } catch (e) {
        self.fs.chmodSync(path6, 438);
        fd = self.fs.openSync(path6, "w", 438);
      }
      if (fd) {
        try {
          self.fs.writeSync(fd, content, 0, content.length, 0);
        } finally {
          self.fs.closeSync(fd);
        }
      }
      self.fs.chmodSync(path6, attr || 438);
      return true;
    };
    Utils.prototype.writeFileToAsync = function(path6, content, overwrite, attr, callback) {
      if (typeof attr === "function") {
        callback = attr;
        attr = void 0;
      }
      const self = this;
      self.fs.exists(path6, function(exist) {
        if (exist && !overwrite) return callback(false);
        self.fs.stat(path6, function(err, stat) {
          if (exist && stat.isDirectory()) {
            return callback(false);
          }
          var folder = pth.dirname(path6);
          self.fs.exists(folder, function(exists) {
            if (!exists) self.makeDir(folder);
            self.fs.open(path6, "w", 438, function(err2, fd) {
              if (err2) {
                self.fs.chmod(path6, 438, function() {
                  self.fs.open(path6, "w", 438, function(err3, fd2) {
                    self.fs.write(fd2, content, 0, content.length, 0, function() {
                      self.fs.close(fd2, function() {
                        self.fs.chmod(path6, attr || 438, function() {
                          callback(true);
                        });
                      });
                    });
                  });
                });
              } else if (fd) {
                self.fs.write(fd, content, 0, content.length, 0, function() {
                  self.fs.close(fd, function() {
                    self.fs.chmod(path6, attr || 438, function() {
                      callback(true);
                    });
                  });
                });
              } else {
                self.fs.chmod(path6, attr || 438, function() {
                  callback(true);
                });
              }
            });
          });
        });
      });
    };
    Utils.prototype.findFiles = function(path6) {
      const self = this;
      function findSync(dir, pattern, recursive) {
        if (typeof pattern === "boolean") {
          recursive = pattern;
          pattern = void 0;
        }
        let files = [];
        self.fs.readdirSync(dir).forEach(function(file) {
          const path7 = pth.join(dir, file);
          const stat = self.fs.statSync(path7);
          if (!pattern || pattern.test(path7)) {
            files.push(pth.normalize(path7) + (stat.isDirectory() ? self.sep : ""));
          }
          if (stat.isDirectory() && recursive) files = files.concat(findSync(path7, pattern, recursive));
        });
        return files;
      }
      return findSync(path6, void 0, true);
    };
    Utils.prototype.findFilesAsync = function(dir, cb) {
      const self = this;
      let results = [];
      self.fs.readdir(dir, function(err, list) {
        if (err) return cb(err);
        let list_length = list.length;
        if (!list_length) return cb(null, results);
        list.forEach(function(file) {
          file = pth.join(dir, file);
          self.fs.stat(file, function(err2, stat) {
            if (err2) return cb(err2);
            if (stat) {
              results.push(pth.normalize(file) + (stat.isDirectory() ? self.sep : ""));
              if (stat.isDirectory()) {
                self.findFilesAsync(file, function(err3, res) {
                  if (err3) return cb(err3);
                  results = results.concat(res);
                  if (!--list_length) cb(null, results);
                });
              } else {
                if (!--list_length) cb(null, results);
              }
            }
          });
        });
      });
    };
    Utils.prototype.getAttributes = function() {
    };
    Utils.prototype.setAttributes = function() {
    };
    Utils.crc32update = function(crc, byte) {
      return crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
    };
    Utils.crc32 = function(buf) {
      if (typeof buf === "string") {
        buf = Buffer.from(buf, "utf8");
      }
      let len = buf.length;
      let crc = ~0;
      for (let off = 0; off < len; ) crc = Utils.crc32update(crc, buf[off++]);
      return ~crc >>> 0;
    };
    Utils.methodToString = function(method) {
      switch (method) {
        case Constants.STORED:
          return "STORED (" + method + ")";
        case Constants.DEFLATED:
          return "DEFLATED (" + method + ")";
        default:
          return "UNSUPPORTED (" + method + ")";
      }
    };
    Utils.canonical = function(path6) {
      if (!path6) return "";
      const safeSuffix = pth.posix.normalize("/" + path6.split("\\").join("/"));
      return pth.join(".", safeSuffix);
    };
    Utils.zipnamefix = function(path6) {
      if (!path6) return "";
      const safeSuffix = pth.posix.normalize("/" + path6.split("\\").join("/"));
      return pth.posix.join(".", safeSuffix);
    };
    Utils.findLast = function(arr, callback) {
      if (!Array.isArray(arr)) throw new TypeError("arr is not array");
      const len = arr.length >>> 0;
      for (let i = len - 1; i >= 0; i--) {
        if (callback(arr[i], i, arr)) {
          return arr[i];
        }
      }
      return void 0;
    };
    Utils.sanitize = function(prefix, name) {
      prefix = pth.resolve(pth.normalize(prefix));
      var parts = name.split("/");
      for (var i = 0, l = parts.length; i < l; i++) {
        var path6 = pth.normalize(pth.join(prefix, parts.slice(i, l).join(pth.sep)));
        if (path6.indexOf(prefix) === 0) {
          return path6;
        }
      }
      return pth.normalize(pth.join(prefix, pth.basename(name)));
    };
    Utils.toBuffer = function toBuffer(input, encoder) {
      if (Buffer.isBuffer(input)) {
        return input;
      } else if (input instanceof Uint8Array) {
        return Buffer.from(input);
      } else {
        return typeof input === "string" ? encoder(input) : Buffer.alloc(0);
      }
    };
    Utils.readBigUInt64LE = function(buffer, index) {
      var slice = Buffer.from(buffer.slice(index, index + 8));
      slice.swap64();
      return parseInt(`0x${slice.toString("hex")}`);
    };
    Utils.fromDOS2Date = function(val) {
      return new Date((val >> 25 & 127) + 1980, Math.max((val >> 21 & 15) - 1, 0), Math.max(val >> 16 & 31, 1), val >> 11 & 31, val >> 5 & 63, (val & 31) << 1);
    };
    Utils.fromDate2DOS = function(val) {
      let date = 0;
      let time = 0;
      if (val.getFullYear() > 1979) {
        date = (val.getFullYear() - 1980 & 127) << 9 | val.getMonth() + 1 << 5 | val.getDate();
        time = val.getHours() << 11 | val.getMinutes() << 5 | val.getSeconds() >> 1;
      }
      return date << 16 | time;
    };
    Utils.isWin = isWin;
    Utils.crcTable = crcTable;
  }
});

// node_modules/adm-zip/util/fattr.js
var require_fattr = __commonJS({
  "node_modules/adm-zip/util/fattr.js"(exports2, module2) {
    var pth = require("path");
    module2.exports = function(path6, { fs: fs5 }) {
      var _path = path6 || "", _obj = newAttr(), _stat = null;
      function newAttr() {
        return {
          directory: false,
          readonly: false,
          hidden: false,
          executable: false,
          mtime: 0,
          atime: 0
        };
      }
      if (_path && fs5.existsSync(_path)) {
        _stat = fs5.statSync(_path);
        _obj.directory = _stat.isDirectory();
        _obj.mtime = _stat.mtime;
        _obj.atime = _stat.atime;
        _obj.executable = (73 & _stat.mode) !== 0;
        _obj.readonly = (128 & _stat.mode) === 0;
        _obj.hidden = pth.basename(_path)[0] === ".";
      } else {
        console.warn("Invalid path: " + _path);
      }
      return {
        get directory() {
          return _obj.directory;
        },
        get readOnly() {
          return _obj.readonly;
        },
        get hidden() {
          return _obj.hidden;
        },
        get mtime() {
          return _obj.mtime;
        },
        get atime() {
          return _obj.atime;
        },
        get executable() {
          return _obj.executable;
        },
        decodeAttributes: function() {
        },
        encodeAttributes: function() {
        },
        toJSON: function() {
          return {
            path: _path,
            isDirectory: _obj.directory,
            isReadOnly: _obj.readonly,
            isHidden: _obj.hidden,
            isExecutable: _obj.executable,
            mTime: _obj.mtime,
            aTime: _obj.atime
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/util/decoder.js
var require_decoder = __commonJS({
  "node_modules/adm-zip/util/decoder.js"(exports2, module2) {
    module2.exports = {
      efs: true,
      encode: (data) => Buffer.from(data, "utf8"),
      decode: (data) => data.toString("utf8")
    };
  }
});

// node_modules/adm-zip/util/index.js
var require_util = __commonJS({
  "node_modules/adm-zip/util/index.js"(exports2, module2) {
    module2.exports = require_utils();
    module2.exports.Constants = require_constants();
    module2.exports.Errors = require_errors();
    module2.exports.FileAttr = require_fattr();
    module2.exports.decoder = require_decoder();
  }
});

// node_modules/adm-zip/headers/entryHeader.js
var require_entryHeader = __commonJS({
  "node_modules/adm-zip/headers/entryHeader.js"(exports2, module2) {
    var Utils = require_util();
    var Constants = Utils.Constants;
    module2.exports = function() {
      var _verMade = 20, _version = 10, _flags = 0, _method = 0, _time = 0, _crc = 0, _compressedSize = 0, _size = 0, _fnameLen = 0, _extraLen = 0, _comLen = 0, _diskStart = 0, _inattr = 0, _attr = 0, _offset = 0;
      _verMade |= Utils.isWin ? 2560 : 768;
      _flags |= Constants.FLG_EFS;
      const _localHeader = {
        extraLen: 0
      };
      const uint32 = (val) => Math.max(0, val) >>> 0;
      const uint16 = (val) => Math.max(0, val) & 65535;
      const uint8 = (val) => Math.max(0, val) & 255;
      _time = Utils.fromDate2DOS(/* @__PURE__ */ new Date());
      return {
        get made() {
          return _verMade;
        },
        set made(val) {
          _verMade = val;
        },
        get version() {
          return _version;
        },
        set version(val) {
          _version = val;
        },
        get flags() {
          return _flags;
        },
        set flags(val) {
          _flags = val;
        },
        get flags_efs() {
          return (_flags & Constants.FLG_EFS) > 0;
        },
        set flags_efs(val) {
          if (val) {
            _flags |= Constants.FLG_EFS;
          } else {
            _flags &= ~Constants.FLG_EFS;
          }
        },
        get flags_desc() {
          return (_flags & Constants.FLG_DESC) > 0;
        },
        set flags_desc(val) {
          if (val) {
            _flags |= Constants.FLG_DESC;
          } else {
            _flags &= ~Constants.FLG_DESC;
          }
        },
        get method() {
          return _method;
        },
        set method(val) {
          switch (val) {
            case Constants.STORED:
              this.version = 10;
            case Constants.DEFLATED:
            default:
              this.version = 20;
          }
          _method = val;
        },
        get time() {
          return Utils.fromDOS2Date(this.timeval);
        },
        set time(val) {
          this.timeval = Utils.fromDate2DOS(val);
        },
        get timeval() {
          return _time;
        },
        set timeval(val) {
          _time = uint32(val);
        },
        get timeHighByte() {
          return uint8(_time >>> 8);
        },
        get crc() {
          return _crc;
        },
        set crc(val) {
          _crc = uint32(val);
        },
        get compressedSize() {
          return _compressedSize;
        },
        set compressedSize(val) {
          _compressedSize = uint32(val);
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = uint32(val);
        },
        get fileNameLength() {
          return _fnameLen;
        },
        set fileNameLength(val) {
          _fnameLen = val;
        },
        get extraLength() {
          return _extraLen;
        },
        set extraLength(val) {
          _extraLen = val;
        },
        get extraLocalLength() {
          return _localHeader.extraLen;
        },
        set extraLocalLength(val) {
          _localHeader.extraLen = val;
        },
        get commentLength() {
          return _comLen;
        },
        set commentLength(val) {
          _comLen = val;
        },
        get diskNumStart() {
          return _diskStart;
        },
        set diskNumStart(val) {
          _diskStart = uint32(val);
        },
        get inAttr() {
          return _inattr;
        },
        set inAttr(val) {
          _inattr = uint32(val);
        },
        get attr() {
          return _attr;
        },
        set attr(val) {
          _attr = uint32(val);
        },
        // get Unix file permissions
        get fileAttr() {
          return (_attr || 0) >> 16 & 4095;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = uint32(val);
        },
        get encrypted() {
          return (_flags & Constants.FLG_ENC) === Constants.FLG_ENC;
        },
        get centralHeaderSize() {
          return Constants.CENHDR + _fnameLen + _extraLen + _comLen;
        },
        get realDataOffset() {
          return _offset + Constants.LOCHDR + _localHeader.fnameLen + _localHeader.extraLen;
        },
        get localHeader() {
          return _localHeader;
        },
        loadLocalHeaderFromBinary: function(input) {
          var data = input.slice(_offset, _offset + Constants.LOCHDR);
          if (data.readUInt32LE(0) !== Constants.LOCSIG) {
            throw Utils.Errors.INVALID_LOC();
          }
          _localHeader.version = data.readUInt16LE(Constants.LOCVER);
          _localHeader.flags = data.readUInt16LE(Constants.LOCFLG);
          _localHeader.method = data.readUInt16LE(Constants.LOCHOW);
          _localHeader.time = data.readUInt32LE(Constants.LOCTIM);
          _localHeader.crc = data.readUInt32LE(Constants.LOCCRC);
          _localHeader.compressedSize = data.readUInt32LE(Constants.LOCSIZ);
          _localHeader.size = data.readUInt32LE(Constants.LOCLEN);
          _localHeader.fnameLen = data.readUInt16LE(Constants.LOCNAM);
          _localHeader.extraLen = data.readUInt16LE(Constants.LOCEXT);
          const extraStart = _offset + Constants.LOCHDR + _localHeader.fnameLen;
          const extraEnd = extraStart + _localHeader.extraLen;
          return input.slice(extraStart, extraEnd);
        },
        loadFromBinary: function(data) {
          if (data.length !== Constants.CENHDR || data.readUInt32LE(0) !== Constants.CENSIG) {
            throw Utils.Errors.INVALID_CEN();
          }
          _verMade = data.readUInt16LE(Constants.CENVEM);
          _version = data.readUInt16LE(Constants.CENVER);
          _flags = data.readUInt16LE(Constants.CENFLG);
          _method = data.readUInt16LE(Constants.CENHOW);
          _time = data.readUInt32LE(Constants.CENTIM);
          _crc = data.readUInt32LE(Constants.CENCRC);
          _compressedSize = data.readUInt32LE(Constants.CENSIZ);
          _size = data.readUInt32LE(Constants.CENLEN);
          _fnameLen = data.readUInt16LE(Constants.CENNAM);
          _extraLen = data.readUInt16LE(Constants.CENEXT);
          _comLen = data.readUInt16LE(Constants.CENCOM);
          _diskStart = data.readUInt16LE(Constants.CENDSK);
          _inattr = data.readUInt16LE(Constants.CENATT);
          _attr = data.readUInt32LE(Constants.CENATX);
          _offset = data.readUInt32LE(Constants.CENOFF);
        },
        localHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.LOCHDR);
          data.writeUInt32LE(Constants.LOCSIG, 0);
          data.writeUInt16LE(_version, Constants.LOCVER);
          data.writeUInt16LE(_flags, Constants.LOCFLG);
          data.writeUInt16LE(_method, Constants.LOCHOW);
          data.writeUInt32LE(_time, Constants.LOCTIM);
          data.writeUInt32LE(_crc, Constants.LOCCRC);
          data.writeUInt32LE(_compressedSize, Constants.LOCSIZ);
          data.writeUInt32LE(_size, Constants.LOCLEN);
          data.writeUInt16LE(_fnameLen, Constants.LOCNAM);
          data.writeUInt16LE(_localHeader.extraLen, Constants.LOCEXT);
          return data;
        },
        centralHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.CENHDR + _fnameLen + _extraLen + _comLen);
          data.writeUInt32LE(Constants.CENSIG, 0);
          data.writeUInt16LE(_verMade, Constants.CENVEM);
          data.writeUInt16LE(_version, Constants.CENVER);
          data.writeUInt16LE(_flags, Constants.CENFLG);
          data.writeUInt16LE(_method, Constants.CENHOW);
          data.writeUInt32LE(_time, Constants.CENTIM);
          data.writeUInt32LE(_crc, Constants.CENCRC);
          data.writeUInt32LE(_compressedSize, Constants.CENSIZ);
          data.writeUInt32LE(_size, Constants.CENLEN);
          data.writeUInt16LE(_fnameLen, Constants.CENNAM);
          data.writeUInt16LE(_extraLen, Constants.CENEXT);
          data.writeUInt16LE(_comLen, Constants.CENCOM);
          data.writeUInt16LE(_diskStart, Constants.CENDSK);
          data.writeUInt16LE(_inattr, Constants.CENATT);
          data.writeUInt32LE(_attr, Constants.CENATX);
          data.writeUInt32LE(_offset, Constants.CENOFF);
          return data;
        },
        toJSON: function() {
          const bytes = function(nr) {
            return nr + " bytes";
          };
          return {
            made: _verMade,
            version: _version,
            flags: _flags,
            method: Utils.methodToString(_method),
            time: this.time,
            crc: "0x" + _crc.toString(16).toUpperCase(),
            compressedSize: bytes(_compressedSize),
            size: bytes(_size),
            fileNameLength: bytes(_fnameLen),
            extraLength: bytes(_extraLen),
            commentLength: bytes(_comLen),
            diskNumStart: _diskStart,
            inAttr: _inattr,
            attr: _attr,
            offset: _offset,
            centralHeaderSize: bytes(Constants.CENHDR + _fnameLen + _extraLen + _comLen)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/headers/mainHeader.js
var require_mainHeader = __commonJS({
  "node_modules/adm-zip/headers/mainHeader.js"(exports2, module2) {
    var Utils = require_util();
    var Constants = Utils.Constants;
    module2.exports = function() {
      var _volumeEntries = 0, _totalEntries = 0, _size = 0, _offset = 0, _commentLength = 0;
      return {
        get diskEntries() {
          return _volumeEntries;
        },
        set diskEntries(val) {
          _volumeEntries = _totalEntries = val;
        },
        get totalEntries() {
          return _totalEntries;
        },
        set totalEntries(val) {
          _totalEntries = _volumeEntries = val;
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = val;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = val;
        },
        get commentLength() {
          return _commentLength;
        },
        set commentLength(val) {
          _commentLength = val;
        },
        get mainHeaderSize() {
          return Constants.ENDHDR + _commentLength;
        },
        loadFromBinary: function(data) {
          if ((data.length !== Constants.ENDHDR || data.readUInt32LE(0) !== Constants.ENDSIG) && (data.length < Constants.ZIP64HDR || data.readUInt32LE(0) !== Constants.ZIP64SIG)) {
            throw Utils.Errors.INVALID_END();
          }
          if (data.readUInt32LE(0) === Constants.ENDSIG) {
            _volumeEntries = data.readUInt16LE(Constants.ENDSUB);
            _totalEntries = data.readUInt16LE(Constants.ENDTOT);
            _size = data.readUInt32LE(Constants.ENDSIZ);
            _offset = data.readUInt32LE(Constants.ENDOFF);
            _commentLength = data.readUInt16LE(Constants.ENDCOM);
          } else {
            _volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB);
            _totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT);
            _size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZE);
            _offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF);
            _commentLength = 0;
          }
        },
        toBinary: function() {
          var b = Buffer.alloc(Constants.ENDHDR + _commentLength);
          b.writeUInt32LE(Constants.ENDSIG, 0);
          b.writeUInt32LE(0, 4);
          b.writeUInt16LE(_volumeEntries, Constants.ENDSUB);
          b.writeUInt16LE(_totalEntries, Constants.ENDTOT);
          b.writeUInt32LE(_size, Constants.ENDSIZ);
          b.writeUInt32LE(_offset, Constants.ENDOFF);
          b.writeUInt16LE(_commentLength, Constants.ENDCOM);
          b.fill(" ", Constants.ENDHDR);
          return b;
        },
        toJSON: function() {
          const offset = function(nr, len) {
            let offs = nr.toString(16).toUpperCase();
            while (offs.length < len) offs = "0" + offs;
            return "0x" + offs;
          };
          return {
            diskEntries: _volumeEntries,
            totalEntries: _totalEntries,
            size: _size + " bytes",
            offset: offset(_offset, 4),
            commentLength: _commentLength
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/headers/index.js
var require_headers = __commonJS({
  "node_modules/adm-zip/headers/index.js"(exports2) {
    exports2.EntryHeader = require_entryHeader();
    exports2.MainHeader = require_mainHeader();
  }
});

// node_modules/adm-zip/methods/deflater.js
var require_deflater = __commonJS({
  "node_modules/adm-zip/methods/deflater.js"(exports2, module2) {
    module2.exports = function(inbuf) {
      var zlib = require("zlib");
      var opts = { chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024 };
      return {
        deflate: function() {
          return zlib.deflateRawSync(inbuf, opts);
        },
        deflateAsync: function(callback) {
          var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
          tmp.on("data", function(data) {
            parts.push(data);
            total += data.length;
          });
          tmp.on("end", function() {
            var buf = Buffer.alloc(total), written = 0;
            buf.fill(0);
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              part.copy(buf, written);
              written += part.length;
            }
            callback && callback(buf);
          });
          tmp.end(inbuf);
        }
      };
    };
  }
});

// node_modules/adm-zip/methods/inflater.js
var require_inflater = __commonJS({
  "node_modules/adm-zip/methods/inflater.js"(exports2, module2) {
    var version = +(process.versions ? process.versions.node : "").split(".")[0] || 0;
    module2.exports = function(inbuf, expectedLength) {
      var zlib = require("zlib");
      const option = version >= 15 && expectedLength > 0 ? { maxOutputLength: expectedLength } : {};
      return {
        inflate: function() {
          return zlib.inflateRawSync(inbuf, option);
        },
        inflateAsync: function(callback) {
          var tmp = zlib.createInflateRaw(option), parts = [], total = 0;
          tmp.on("data", function(data) {
            parts.push(data);
            total += data.length;
          });
          tmp.on("end", function() {
            var buf = Buffer.alloc(total), written = 0;
            buf.fill(0);
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              part.copy(buf, written);
              written += part.length;
            }
            callback && callback(buf);
          });
          tmp.end(inbuf);
        }
      };
    };
  }
});

// node_modules/adm-zip/methods/zipcrypto.js
var require_zipcrypto = __commonJS({
  "node_modules/adm-zip/methods/zipcrypto.js"(exports2, module2) {
    "use strict";
    var { randomFillSync } = require("crypto");
    var Errors = require_errors();
    var crctable = new Uint32Array(256).map((t, crc) => {
      for (let j = 0; j < 8; j++) {
        if (0 !== (crc & 1)) {
          crc = crc >>> 1 ^ 3988292384;
        } else {
          crc >>>= 1;
        }
      }
      return crc >>> 0;
    });
    var uMul = (a, b) => Math.imul(a, b) >>> 0;
    var crc32update = (pCrc32, bval) => {
      return crctable[(pCrc32 ^ bval) & 255] ^ pCrc32 >>> 8;
    };
    var genSalt = () => {
      if ("function" === typeof randomFillSync) {
        return randomFillSync(Buffer.alloc(12));
      } else {
        return genSalt.node();
      }
    };
    genSalt.node = () => {
      const salt = Buffer.alloc(12);
      const len = salt.length;
      for (let i = 0; i < len; i++) salt[i] = Math.random() * 256 & 255;
      return salt;
    };
    var config = {
      genSalt
    };
    function Initkeys(pw) {
      const pass = Buffer.isBuffer(pw) ? pw : Buffer.from(pw);
      this.keys = new Uint32Array([305419896, 591751049, 878082192]);
      for (let i = 0; i < pass.length; i++) {
        this.updateKeys(pass[i]);
      }
    }
    Initkeys.prototype.updateKeys = function(byteValue) {
      const keys = this.keys;
      keys[0] = crc32update(keys[0], byteValue);
      keys[1] += keys[0] & 255;
      keys[1] = uMul(keys[1], 134775813) + 1;
      keys[2] = crc32update(keys[2], keys[1] >>> 24);
      return byteValue;
    };
    Initkeys.prototype.next = function() {
      const k = (this.keys[2] | 2) >>> 0;
      return uMul(k, k ^ 1) >> 8 & 255;
    };
    function make_decrypter(pwd) {
      const keys = new Initkeys(pwd);
      return function(data) {
        const result = Buffer.alloc(data.length);
        let pos = 0;
        for (let c of data) {
          result[pos++] = keys.updateKeys(c ^ keys.next());
        }
        return result;
      };
    }
    function make_encrypter(pwd) {
      const keys = new Initkeys(pwd);
      return function(data, result, pos = 0) {
        if (!result) result = Buffer.alloc(data.length);
        for (let c of data) {
          const k = keys.next();
          result[pos++] = c ^ k;
          keys.updateKeys(c);
        }
        return result;
      };
    }
    function decrypt(data, header, pwd) {
      if (!data || !Buffer.isBuffer(data) || data.length < 12) {
        return Buffer.alloc(0);
      }
      const decrypter = make_decrypter(pwd);
      const salt = decrypter(data.slice(0, 12));
      const verifyByte = (header.flags & 8) === 8 ? header.timeHighByte : header.crc >>> 24;
      if (salt[11] !== verifyByte) {
        throw Errors.WRONG_PASSWORD();
      }
      return decrypter(data.slice(12));
    }
    function _salter(data) {
      if (Buffer.isBuffer(data) && data.length >= 12) {
        config.genSalt = function() {
          return data.slice(0, 12);
        };
      } else if (data === "node") {
        config.genSalt = genSalt.node;
      } else {
        config.genSalt = genSalt;
      }
    }
    function encrypt(data, header, pwd, oldlike = false) {
      if (data == null) data = Buffer.alloc(0);
      if (!Buffer.isBuffer(data)) data = Buffer.from(data.toString());
      const encrypter = make_encrypter(pwd);
      const salt = config.genSalt();
      salt[11] = header.crc >>> 24 & 255;
      if (oldlike) salt[10] = header.crc >>> 16 & 255;
      const result = Buffer.alloc(data.length + 12);
      encrypter(salt, result);
      return encrypter(data, result, 12);
    }
    module2.exports = { decrypt, encrypt, _salter };
  }
});

// node_modules/adm-zip/methods/index.js
var require_methods = __commonJS({
  "node_modules/adm-zip/methods/index.js"(exports2) {
    exports2.Deflater = require_deflater();
    exports2.Inflater = require_inflater();
    exports2.ZipCrypto = require_zipcrypto();
  }
});

// node_modules/adm-zip/zipEntry.js
var require_zipEntry = __commonJS({
  "node_modules/adm-zip/zipEntry.js"(exports2, module2) {
    var Utils = require_util();
    var Headers = require_headers();
    var Constants = Utils.Constants;
    var Methods = require_methods();
    module2.exports = function(options, input) {
      var _centralHeader = new Headers.EntryHeader(), _entryName = Buffer.alloc(0), _comment = Buffer.alloc(0), _isDirectory = false, uncompressedData = null, _extra = Buffer.alloc(0), _extralocal = Buffer.alloc(0), _efs = true;
      const opts = options;
      const decoder = typeof opts.decoder === "object" ? opts.decoder : Utils.decoder;
      _efs = decoder.hasOwnProperty("efs") ? decoder.efs : false;
      function getCompressedDataFromZip() {
        if (!input || !(input instanceof Uint8Array)) {
          return Buffer.alloc(0);
        }
        _extralocal = _centralHeader.loadLocalHeaderFromBinary(input);
        return input.slice(_centralHeader.realDataOffset, _centralHeader.realDataOffset + _centralHeader.compressedSize);
      }
      function crc32OK(data) {
        if (!_centralHeader.flags_desc) {
          if (Utils.crc32(data) !== _centralHeader.localHeader.crc) {
            return false;
          }
        } else {
          const descriptor = {};
          const dataEndOffset = _centralHeader.realDataOffset + _centralHeader.compressedSize;
          if (input.readUInt32LE(dataEndOffset) == Constants.LOCSIG || input.readUInt32LE(dataEndOffset) == Constants.CENSIG) {
            throw Utils.Errors.DESCRIPTOR_NOT_EXIST();
          }
          if (input.readUInt32LE(dataEndOffset) == Constants.EXTSIG) {
            descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC);
            descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ);
            descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN);
          } else if (input.readUInt16LE(dataEndOffset + 12) === 19280) {
            descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC - 4);
            descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ - 4);
            descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN - 4);
          } else {
            throw Utils.Errors.DESCRIPTOR_UNKNOWN();
          }
          if (descriptor.compressedSize !== _centralHeader.compressedSize || descriptor.size !== _centralHeader.size || descriptor.crc !== _centralHeader.crc) {
            throw Utils.Errors.DESCRIPTOR_FAULTY();
          }
          if (Utils.crc32(data) !== descriptor.crc) {
            return false;
          }
        }
        return true;
      }
      function decompress(async, callback, pass) {
        if (typeof callback === "undefined" && typeof async === "string") {
          pass = async;
          async = void 0;
        }
        if (_isDirectory) {
          if (async && callback) {
            callback(Buffer.alloc(0), Utils.Errors.DIRECTORY_CONTENT_ERROR());
          }
          return Buffer.alloc(0);
        }
        var compressedData = getCompressedDataFromZip();
        if (compressedData.length === 0) {
          if (async && callback) callback(compressedData);
          return compressedData;
        }
        if (_centralHeader.encrypted) {
          if ("string" !== typeof pass && !Buffer.isBuffer(pass)) {
            throw Utils.Errors.INVALID_PASS_PARAM();
          }
          compressedData = Methods.ZipCrypto.decrypt(compressedData, _centralHeader, pass);
        }
        var data = Buffer.alloc(_centralHeader.size);
        switch (_centralHeader.method) {
          case Utils.Constants.STORED:
            compressedData.copy(data);
            if (!crc32OK(data)) {
              if (async && callback) callback(data, Utils.Errors.BAD_CRC());
              throw Utils.Errors.BAD_CRC();
            } else {
              if (async && callback) callback(data);
              return data;
            }
          case Utils.Constants.DEFLATED:
            var inflater = new Methods.Inflater(compressedData, _centralHeader.size);
            if (!async) {
              const result = inflater.inflate(data);
              result.copy(data, 0);
              if (!crc32OK(data)) {
                throw Utils.Errors.BAD_CRC(`"${decoder.decode(_entryName)}"`);
              }
              return data;
            } else {
              inflater.inflateAsync(function(result) {
                result.copy(result, 0);
                if (callback) {
                  if (!crc32OK(result)) {
                    callback(result, Utils.Errors.BAD_CRC());
                  } else {
                    callback(result);
                  }
                }
              });
            }
            break;
          default:
            if (async && callback) callback(Buffer.alloc(0), Utils.Errors.UNKNOWN_METHOD());
            throw Utils.Errors.UNKNOWN_METHOD();
        }
      }
      function compress(async, callback) {
        if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input)) {
          if (async && callback) callback(getCompressedDataFromZip());
          return getCompressedDataFromZip();
        }
        if (uncompressedData.length && !_isDirectory) {
          var compressedData;
          switch (_centralHeader.method) {
            case Utils.Constants.STORED:
              _centralHeader.compressedSize = _centralHeader.size;
              compressedData = Buffer.alloc(uncompressedData.length);
              uncompressedData.copy(compressedData);
              if (async && callback) callback(compressedData);
              return compressedData;
            default:
            case Utils.Constants.DEFLATED:
              var deflater = new Methods.Deflater(uncompressedData);
              if (!async) {
                var deflated = deflater.deflate();
                _centralHeader.compressedSize = deflated.length;
                return deflated;
              } else {
                deflater.deflateAsync(function(data) {
                  compressedData = Buffer.alloc(data.length);
                  _centralHeader.compressedSize = data.length;
                  data.copy(compressedData);
                  callback && callback(compressedData);
                });
              }
              deflater = null;
              break;
          }
        } else if (async && callback) {
          callback(Buffer.alloc(0));
        } else {
          return Buffer.alloc(0);
        }
      }
      function readUInt64LE(buffer, offset) {
        return (buffer.readUInt32LE(offset + 4) << 4) + buffer.readUInt32LE(offset);
      }
      function parseExtra(data) {
        try {
          var offset = 0;
          var signature, size, part;
          while (offset + 4 < data.length) {
            signature = data.readUInt16LE(offset);
            offset += 2;
            size = data.readUInt16LE(offset);
            offset += 2;
            part = data.slice(offset, offset + size);
            offset += size;
            if (Constants.ID_ZIP64 === signature) {
              parseZip64ExtendedInformation(part);
            }
          }
        } catch (error) {
          throw Utils.Errors.EXTRA_FIELD_PARSE_ERROR();
        }
      }
      function parseZip64ExtendedInformation(data) {
        var size, compressedSize, offset, diskNumStart;
        if (data.length >= Constants.EF_ZIP64_SCOMP) {
          size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
          if (_centralHeader.size === Constants.EF_ZIP64_OR_32) {
            _centralHeader.size = size;
          }
        }
        if (data.length >= Constants.EF_ZIP64_RHO) {
          compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
          if (_centralHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
            _centralHeader.compressedSize = compressedSize;
          }
        }
        if (data.length >= Constants.EF_ZIP64_DSN) {
          offset = readUInt64LE(data, Constants.EF_ZIP64_RHO);
          if (_centralHeader.offset === Constants.EF_ZIP64_OR_32) {
            _centralHeader.offset = offset;
          }
        }
        if (data.length >= Constants.EF_ZIP64_DSN + 4) {
          diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
          if (_centralHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
            _centralHeader.diskNumStart = diskNumStart;
          }
        }
      }
      return {
        get entryName() {
          return decoder.decode(_entryName);
        },
        get rawEntryName() {
          return _entryName;
        },
        set entryName(val) {
          _entryName = Utils.toBuffer(val, decoder.encode);
          var lastChar = _entryName[_entryName.length - 1];
          _isDirectory = lastChar === 47 || lastChar === 92;
          _centralHeader.fileNameLength = _entryName.length;
        },
        get efs() {
          if (typeof _efs === "function") {
            return _efs(this.entryName);
          } else {
            return _efs;
          }
        },
        get extra() {
          return _extra;
        },
        set extra(val) {
          _extra = val;
          _centralHeader.extraLength = val.length;
          parseExtra(val);
        },
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          _comment = Utils.toBuffer(val, decoder.encode);
          _centralHeader.commentLength = _comment.length;
          if (_comment.length > 65535) throw Utils.Errors.COMMENT_TOO_LONG();
        },
        get name() {
          var n = decoder.decode(_entryName);
          return _isDirectory ? n.substr(n.length - 1).split("/").pop() : n.split("/").pop();
        },
        get isDirectory() {
          return _isDirectory;
        },
        getCompressedData: function() {
          return compress(false, null);
        },
        getCompressedDataAsync: function(callback) {
          compress(true, callback);
        },
        setData: function(value) {
          uncompressedData = Utils.toBuffer(value, Utils.decoder.encode);
          if (!_isDirectory && uncompressedData.length) {
            _centralHeader.size = uncompressedData.length;
            _centralHeader.method = Utils.Constants.DEFLATED;
            _centralHeader.crc = Utils.crc32(value);
            _centralHeader.changed = true;
          } else {
            _centralHeader.method = Utils.Constants.STORED;
          }
        },
        getData: function(pass) {
          if (_centralHeader.changed) {
            return uncompressedData;
          } else {
            return decompress(false, null, pass);
          }
        },
        getDataAsync: function(callback, pass) {
          if (_centralHeader.changed) {
            callback(uncompressedData);
          } else {
            decompress(true, callback, pass);
          }
        },
        set attr(attr) {
          _centralHeader.attr = attr;
        },
        get attr() {
          return _centralHeader.attr;
        },
        set header(data) {
          _centralHeader.loadFromBinary(data);
        },
        get header() {
          return _centralHeader;
        },
        packCentralHeader: function() {
          _centralHeader.flags_efs = this.efs;
          _centralHeader.extraLength = _extra.length;
          var header = _centralHeader.centralHeaderToBinary();
          var addpos = Utils.Constants.CENHDR;
          _entryName.copy(header, addpos);
          addpos += _entryName.length;
          _extra.copy(header, addpos);
          addpos += _centralHeader.extraLength;
          _comment.copy(header, addpos);
          return header;
        },
        packLocalHeader: function() {
          let addpos = 0;
          _centralHeader.flags_efs = this.efs;
          _centralHeader.extraLocalLength = _extralocal.length;
          const localHeaderBuf = _centralHeader.localHeaderToBinary();
          const localHeader = Buffer.alloc(localHeaderBuf.length + _entryName.length + _centralHeader.extraLocalLength);
          localHeaderBuf.copy(localHeader, addpos);
          addpos += localHeaderBuf.length;
          _entryName.copy(localHeader, addpos);
          addpos += _entryName.length;
          _extralocal.copy(localHeader, addpos);
          addpos += _extralocal.length;
          return localHeader;
        },
        toJSON: function() {
          const bytes = function(nr) {
            return "<" + (nr && nr.length + " bytes buffer" || "null") + ">";
          };
          return {
            entryName: this.entryName,
            name: this.name,
            comment: this.comment,
            isDirectory: this.isDirectory,
            header: _centralHeader.toJSON(),
            compressedData: bytes(input),
            data: bytes(uncompressedData)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/zipFile.js
var require_zipFile = __commonJS({
  "node_modules/adm-zip/zipFile.js"(exports2, module2) {
    var ZipEntry = require_zipEntry();
    var Headers = require_headers();
    var Utils = require_util();
    module2.exports = function(inBuffer, options) {
      var entryList = [], entryTable = {}, _comment = Buffer.alloc(0), mainHeader = new Headers.MainHeader(), loadedEntries = false;
      var password = null;
      const temporary = /* @__PURE__ */ new Set();
      const opts = options;
      const { noSort, decoder } = opts;
      if (inBuffer) {
        readMainHeader(opts.readEntries);
      } else {
        loadedEntries = true;
      }
      function makeTemporaryFolders() {
        const foldersList = /* @__PURE__ */ new Set();
        for (const elem of Object.keys(entryTable)) {
          const elements = elem.split("/");
          elements.pop();
          if (!elements.length) continue;
          for (let i = 0; i < elements.length; i++) {
            const sub = elements.slice(0, i + 1).join("/") + "/";
            foldersList.add(sub);
          }
        }
        for (const elem of foldersList) {
          if (!(elem in entryTable)) {
            const tempfolder = new ZipEntry(opts);
            tempfolder.entryName = elem;
            tempfolder.attr = 16;
            tempfolder.temporary = true;
            entryList.push(tempfolder);
            entryTable[tempfolder.entryName] = tempfolder;
            temporary.add(tempfolder);
          }
        }
      }
      function readEntries() {
        loadedEntries = true;
        entryTable = {};
        if (mainHeader.diskEntries > (inBuffer.length - mainHeader.offset) / Utils.Constants.CENHDR) {
          throw Utils.Errors.DISK_ENTRY_TOO_LARGE();
        }
        entryList = new Array(mainHeader.diskEntries);
        var index = mainHeader.offset;
        for (var i = 0; i < entryList.length; i++) {
          var tmp = index, entry = new ZipEntry(opts, inBuffer);
          entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);
          entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);
          if (entry.header.extraLength) {
            entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength);
          }
          if (entry.header.commentLength) entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength);
          index += entry.header.centralHeaderSize;
          entryList[i] = entry;
          entryTable[entry.entryName] = entry;
        }
        temporary.clear();
        makeTemporaryFolders();
      }
      function readMainHeader(readNow) {
        var i = inBuffer.length - Utils.Constants.ENDHDR, max = Math.max(0, i - 65535), n = max, endStart = inBuffer.length, endOffset = -1, commentEnd = 0;
        const trailingSpace = typeof opts.trailingSpace === "boolean" ? opts.trailingSpace : false;
        if (trailingSpace) max = 0;
        for (i; i >= n; i--) {
          if (inBuffer[i] !== 80) continue;
          if (inBuffer.readUInt32LE(i) === Utils.Constants.ENDSIG) {
            endOffset = i;
            commentEnd = i;
            endStart = i + Utils.Constants.ENDHDR;
            n = i - Utils.Constants.END64HDR;
            continue;
          }
          if (inBuffer.readUInt32LE(i) === Utils.Constants.END64SIG) {
            n = max;
            continue;
          }
          if (inBuffer.readUInt32LE(i) === Utils.Constants.ZIP64SIG) {
            endOffset = i;
            endStart = i + Utils.readBigUInt64LE(inBuffer, i + Utils.Constants.ZIP64SIZE) + Utils.Constants.ZIP64LEAD;
            break;
          }
        }
        if (endOffset == -1) throw Utils.Errors.INVALID_FORMAT();
        mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart));
        if (mainHeader.commentLength) {
          _comment = inBuffer.slice(commentEnd + Utils.Constants.ENDHDR);
        }
        if (readNow) readEntries();
      }
      function sortEntries() {
        if (entryList.length > 1 && !noSort) {
          entryList.sort((a, b) => a.entryName.toLowerCase().localeCompare(b.entryName.toLowerCase()));
        }
      }
      return {
        /**
         * Returns an array of ZipEntry objects existent in the current opened archive
         * @return Array
         */
        get entries() {
          if (!loadedEntries) {
            readEntries();
          }
          return entryList.filter((e) => !temporary.has(e));
        },
        /**
         * Archive comment
         * @return {String}
         */
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          _comment = Utils.toBuffer(val, decoder.encode);
          mainHeader.commentLength = _comment.length;
        },
        getEntryCount: function() {
          if (!loadedEntries) {
            return mainHeader.diskEntries;
          }
          return entryList.length;
        },
        forEach: function(callback) {
          this.entries.forEach(callback);
        },
        /**
         * Returns a reference to the entry with the given name or null if entry is inexistent
         *
         * @param entryName
         * @return ZipEntry
         */
        getEntry: function(entryName) {
          if (!loadedEntries) {
            readEntries();
          }
          return entryTable[entryName] || null;
        },
        /**
         * Adds the given entry to the entry list
         *
         * @param entry
         */
        setEntry: function(entry) {
          if (!loadedEntries) {
            readEntries();
          }
          entryList.push(entry);
          entryTable[entry.entryName] = entry;
          mainHeader.totalEntries = entryList.length;
        },
        /**
         * Removes the file with the given name from the entry list.
         *
         * If the entry is a directory, then all nested files and directories will be removed
         * @param entryName
         * @returns {void}
         */
        deleteFile: function(entryName, withsubfolders = true) {
          if (!loadedEntries) {
            readEntries();
          }
          const entry = entryTable[entryName];
          const list = this.getEntryChildren(entry, withsubfolders).map((child) => child.entryName);
          list.forEach(this.deleteEntry);
        },
        /**
         * Removes the entry with the given name from the entry list.
         *
         * @param {string} entryName
         * @returns {void}
         */
        deleteEntry: function(entryName) {
          if (!loadedEntries) {
            readEntries();
          }
          const entry = entryTable[entryName];
          const index = entryList.indexOf(entry);
          if (index >= 0) {
            entryList.splice(index, 1);
            delete entryTable[entryName];
            mainHeader.totalEntries = entryList.length;
          }
        },
        /**
         *  Iterates and returns all nested files and directories of the given entry
         *
         * @param entry
         * @return Array
         */
        getEntryChildren: function(entry, subfolders = true) {
          if (!loadedEntries) {
            readEntries();
          }
          if (typeof entry === "object") {
            if (entry.isDirectory && subfolders) {
              const list = [];
              const name = entry.entryName;
              for (const zipEntry of entryList) {
                if (zipEntry.entryName.startsWith(name)) {
                  list.push(zipEntry);
                }
              }
              return list;
            } else {
              return [entry];
            }
          }
          return [];
        },
        /**
         *  How many child elements entry has
         *
         * @param {ZipEntry} entry
         * @return {integer}
         */
        getChildCount: function(entry) {
          if (entry && entry.isDirectory) {
            const list = this.getEntryChildren(entry);
            return list.includes(entry) ? list.length - 1 : list.length;
          }
          return 0;
        },
        /**
         * Returns the zip file
         *
         * @return Buffer
         */
        compressToBuffer: function() {
          if (!loadedEntries) {
            readEntries();
          }
          sortEntries();
          const dataBlock = [];
          const headerBlocks = [];
          let totalSize = 0;
          let dindex = 0;
          mainHeader.size = 0;
          mainHeader.offset = 0;
          let totalEntries = 0;
          for (const entry of this.entries) {
            const compressedData = entry.getCompressedData();
            entry.header.offset = dindex;
            const localHeader = entry.packLocalHeader();
            const dataLength = localHeader.length + compressedData.length;
            dindex += dataLength;
            dataBlock.push(localHeader);
            dataBlock.push(compressedData);
            const centralHeader = entry.packCentralHeader();
            headerBlocks.push(centralHeader);
            mainHeader.size += centralHeader.length;
            totalSize += dataLength + centralHeader.length;
            totalEntries++;
          }
          totalSize += mainHeader.mainHeaderSize;
          mainHeader.offset = dindex;
          mainHeader.totalEntries = totalEntries;
          dindex = 0;
          const outBuffer = Buffer.alloc(totalSize);
          for (const content of dataBlock) {
            content.copy(outBuffer, dindex);
            dindex += content.length;
          }
          for (const content of headerBlocks) {
            content.copy(outBuffer, dindex);
            dindex += content.length;
          }
          const mh = mainHeader.toBinary();
          if (_comment) {
            _comment.copy(mh, Utils.Constants.ENDHDR);
          }
          mh.copy(outBuffer, dindex);
          inBuffer = outBuffer;
          loadedEntries = false;
          return outBuffer;
        },
        toAsyncBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          try {
            if (!loadedEntries) {
              readEntries();
            }
            sortEntries();
            const dataBlock = [];
            const centralHeaders = [];
            let totalSize = 0;
            let dindex = 0;
            let totalEntries = 0;
            mainHeader.size = 0;
            mainHeader.offset = 0;
            const compress2Buffer = function(entryLists) {
              if (entryLists.length > 0) {
                const entry = entryLists.shift();
                const name = entry.entryName + entry.extra.toString();
                if (onItemStart) onItemStart(name);
                entry.getCompressedDataAsync(function(compressedData) {
                  if (onItemEnd) onItemEnd(name);
                  entry.header.offset = dindex;
                  const localHeader = entry.packLocalHeader();
                  const dataLength = localHeader.length + compressedData.length;
                  dindex += dataLength;
                  dataBlock.push(localHeader);
                  dataBlock.push(compressedData);
                  const centalHeader = entry.packCentralHeader();
                  centralHeaders.push(centalHeader);
                  mainHeader.size += centalHeader.length;
                  totalSize += dataLength + centalHeader.length;
                  totalEntries++;
                  compress2Buffer(entryLists);
                });
              } else {
                totalSize += mainHeader.mainHeaderSize;
                mainHeader.offset = dindex;
                mainHeader.totalEntries = totalEntries;
                dindex = 0;
                const outBuffer = Buffer.alloc(totalSize);
                dataBlock.forEach(function(content) {
                  content.copy(outBuffer, dindex);
                  dindex += content.length;
                });
                centralHeaders.forEach(function(content) {
                  content.copy(outBuffer, dindex);
                  dindex += content.length;
                });
                const mh = mainHeader.toBinary();
                if (_comment) {
                  _comment.copy(mh, Utils.Constants.ENDHDR);
                }
                mh.copy(outBuffer, dindex);
                inBuffer = outBuffer;
                loadedEntries = false;
                onSuccess(outBuffer);
              }
            };
            compress2Buffer(Array.from(this.entries));
          } catch (e) {
            onFail(e);
          }
        }
      };
    };
  }
});

// node_modules/adm-zip/adm-zip.js
var require_adm_zip = __commonJS({
  "node_modules/adm-zip/adm-zip.js"(exports2, module2) {
    var Utils = require_util();
    var pth = require("path");
    var ZipEntry = require_zipEntry();
    var ZipFile = require_zipFile();
    var get_Bool = (...val) => Utils.findLast(val, (c) => typeof c === "boolean");
    var get_Str = (...val) => Utils.findLast(val, (c) => typeof c === "string");
    var get_Fun = (...val) => Utils.findLast(val, (c) => typeof c === "function");
    var defaultOptions = {
      // option "noSort" : if true it disables files sorting
      noSort: false,
      // read entries during load (initial loading may be slower)
      readEntries: false,
      // default method is none
      method: Utils.Constants.NONE,
      // file system
      fs: null
    };
    module2.exports = function(input, options) {
      let inBuffer = null;
      const opts = Object.assign(/* @__PURE__ */ Object.create(null), defaultOptions);
      if (input && "object" === typeof input) {
        if (!(input instanceof Uint8Array)) {
          Object.assign(opts, input);
          input = opts.input ? opts.input : void 0;
          if (opts.input) delete opts.input;
        }
        if (Buffer.isBuffer(input)) {
          inBuffer = input;
          opts.method = Utils.Constants.BUFFER;
          input = void 0;
        }
      }
      Object.assign(opts, options);
      const filetools = new Utils(opts);
      if (typeof opts.decoder !== "object" || typeof opts.decoder.encode !== "function" || typeof opts.decoder.decode !== "function") {
        opts.decoder = Utils.decoder;
      }
      if (input && "string" === typeof input) {
        if (filetools.fs.existsSync(input)) {
          opts.method = Utils.Constants.FILE;
          opts.filename = input;
          inBuffer = filetools.fs.readFileSync(input);
        } else {
          throw Utils.Errors.INVALID_FILENAME();
        }
      }
      const _zip = new ZipFile(inBuffer, opts);
      const { canonical, sanitize, zipnamefix } = Utils;
      function getEntry(entry) {
        if (entry && _zip) {
          var item;
          if (typeof entry === "string") item = _zip.getEntry(pth.posix.normalize(entry));
          if (typeof entry === "object" && typeof entry.entryName !== "undefined" && typeof entry.header !== "undefined") item = _zip.getEntry(entry.entryName);
          if (item) {
            return item;
          }
        }
        return null;
      }
      function fixPath(zipPath) {
        const { join, normalize, sep } = pth.posix;
        return join(".", normalize(sep + zipPath.split("\\").join(sep) + sep));
      }
      function filenameFilter(filterfn) {
        if (filterfn instanceof RegExp) {
          return /* @__PURE__ */ (function(rx) {
            return function(filename) {
              return rx.test(filename);
            };
          })(filterfn);
        } else if ("function" !== typeof filterfn) {
          return () => true;
        }
        return filterfn;
      }
      const relativePath = (local, entry) => {
        let lastChar = entry.slice(-1);
        lastChar = lastChar === filetools.sep ? filetools.sep : "";
        return pth.relative(local, entry) + lastChar;
      };
      return {
        /**
         * Extracts the given entry from the archive and returns the content as a Buffer object
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {Buffer|string} [pass] - password
         * @return Buffer or Null in case of error
         */
        readFile: function(entry, pass) {
          var item = getEntry(entry);
          return item && item.getData(pass) || null;
        },
        /**
         * Returns how many child elements has on entry (directories) on files it is always 0
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @returns {integer}
         */
        childCount: function(entry) {
          const item = getEntry(entry);
          if (item) {
            return _zip.getChildCount(item);
          }
        },
        /**
         * Asynchronous readFile
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         *
         * @return Buffer or Null in case of error
         */
        readFileAsync: function(entry, callback) {
          var item = getEntry(entry);
          if (item) {
            item.getDataAsync(callback);
          } else {
            callback(null, "getEntry failed for:" + entry);
          }
        },
        /**
         * Extracts the given entry from the archive and returns the content as plain text in the given encoding
         * @param {ZipEntry|string} entry - ZipEntry object or String with the full path of the entry
         * @param {string} encoding - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsText: function(entry, encoding) {
          var item = getEntry(entry);
          if (item) {
            var data = item.getData();
            if (data && data.length) {
              return data.toString(encoding || "utf8");
            }
          }
          return "";
        },
        /**
         * Asynchronous readAsText
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         * @param {string} [encoding] - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsTextAsync: function(entry, callback, encoding) {
          var item = getEntry(entry);
          if (item) {
            item.getDataAsync(function(data, err) {
              if (err) {
                callback(data, err);
                return;
              }
              if (data && data.length) {
                callback(data.toString(encoding || "utf8"));
              } else {
                callback("");
              }
            });
          } else {
            callback("");
          }
        },
        /**
         * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
         *
         * @param {ZipEntry|string} entry
         * @returns {void}
         */
        deleteFile: function(entry, withsubfolders = true) {
          var item = getEntry(entry);
          if (item) {
            _zip.deleteFile(item.entryName, withsubfolders);
          }
        },
        /**
         * Remove the entry from the file or directory without affecting any nested entries
         *
         * @param {ZipEntry|string} entry
         * @returns {void}
         */
        deleteEntry: function(entry) {
          var item = getEntry(entry);
          if (item) {
            _zip.deleteEntry(item.entryName);
          }
        },
        /**
         * Adds a comment to the zip. The zip must be rewritten after adding the comment.
         *
         * @param {string} comment
         */
        addZipComment: function(comment) {
          _zip.comment = comment;
        },
        /**
         * Returns the zip comment
         *
         * @return String
         */
        getZipComment: function() {
          return _zip.comment || "";
        },
        /**
         * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
         * The comment cannot exceed 65535 characters in length
         *
         * @param {ZipEntry} entry
         * @param {string} comment
         */
        addZipEntryComment: function(entry, comment) {
          var item = getEntry(entry);
          if (item) {
            item.comment = comment;
          }
        },
        /**
         * Returns the comment of the specified entry
         *
         * @param {ZipEntry} entry
         * @return String
         */
        getZipEntryComment: function(entry) {
          var item = getEntry(entry);
          if (item) {
            return item.comment || "";
          }
          return "";
        },
        /**
         * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
         *
         * @param {ZipEntry} entry
         * @param {Buffer} content
         */
        updateFile: function(entry, content) {
          var item = getEntry(entry);
          if (item) {
            item.setData(content);
          }
        },
        /**
         * Adds a file from the disk to the archive
         *
         * @param {string} localPath File to add to zip
         * @param {string} [zipPath] Optional path inside the zip
         * @param {string} [zipName] Optional name for the file
         * @param {string} [comment] Optional file comment
         */
        addLocalFile: function(localPath2, zipPath, zipName, comment) {
          if (filetools.fs.existsSync(localPath2)) {
            zipPath = zipPath ? fixPath(zipPath) : "";
            const p = pth.win32.basename(pth.win32.normalize(localPath2));
            zipPath += zipName ? zipName : p;
            const _attr = filetools.fs.statSync(localPath2);
            const data = _attr.isFile() ? filetools.fs.readFileSync(localPath2) : Buffer.alloc(0);
            if (_attr.isDirectory()) zipPath += filetools.sep;
            this.addFile(zipPath, data, comment, _attr);
          } else {
            throw Utils.Errors.FILE_NOT_FOUND(localPath2);
          }
        },
        /**
         * Callback for showing if everything was done.
         *
         * @callback doneCallback
         * @param {Error} err - Error object
         * @param {boolean} done - was request fully completed
         */
        /**
         * Adds a file from the disk to the archive
         *
         * @param {(object|string)} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the file.
         * @param {string} [options.comment] - Optional file comment.
         * @param {string} [options.zipPath] - Optional path inside the zip
         * @param {string} [options.zipName] - Optional name for the file
         * @param {doneCallback} callback - The callback that handles the response.
         */
        addLocalFileAsync: function(options2, callback) {
          options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
          const localPath2 = pth.resolve(options2.localPath);
          const { comment } = options2;
          let { zipPath, zipName } = options2;
          const self = this;
          filetools.fs.stat(localPath2, function(err, stats) {
            if (err) return callback(err, false);
            zipPath = zipPath ? fixPath(zipPath) : "";
            const p = pth.win32.basename(pth.win32.normalize(localPath2));
            zipPath += zipName ? zipName : p;
            if (stats.isFile()) {
              filetools.fs.readFile(localPath2, function(err2, data) {
                if (err2) return callback(err2, false);
                self.addFile(zipPath, data, comment, stats);
                return setImmediate(callback, void 0, true);
              });
            } else if (stats.isDirectory()) {
              zipPath += filetools.sep;
              self.addFile(zipPath, Buffer.alloc(0), comment, stats);
              return setImmediate(callback, void 0, true);
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - local path to the folder
         * @param {string} [zipPath] - optional path inside zip
         * @param {(RegExp|function)} [filter] - optional RegExp or Function if files match will be included.
         */
        addLocalFolder: function(localPath2, zipPath, filter) {
          filter = filenameFilter(filter);
          zipPath = zipPath ? fixPath(zipPath) : "";
          localPath2 = pth.normalize(localPath2);
          if (filetools.fs.existsSync(localPath2)) {
            const items = filetools.findFiles(localPath2);
            const self = this;
            if (items.length) {
              for (const filepath of items) {
                const p = pth.join(zipPath, relativePath(localPath2, filepath));
                if (filter(p)) {
                  self.addLocalFile(filepath, pth.dirname(p));
                }
              }
            }
          } else {
            throw Utils.Errors.FILE_NOT_FOUND(localPath2);
          }
        },
        /**
         * Asynchronous addLocalFolder
         * @param {string} localPath
         * @param {callback} callback
         * @param {string} [zipPath] optional path inside zip
         * @param {RegExp|function} [filter] optional RegExp or Function if files match will
         *               be included.
         */
        addLocalFolderAsync: function(localPath2, callback, zipPath, filter) {
          filter = filenameFilter(filter);
          zipPath = zipPath ? fixPath(zipPath) : "";
          localPath2 = pth.normalize(localPath2);
          var self = this;
          filetools.fs.open(localPath2, "r", function(err) {
            if (err && err.code === "ENOENT") {
              callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath2));
            } else if (err) {
              callback(void 0, err);
            } else {
              var items = filetools.findFiles(localPath2);
              var i = -1;
              var next = function() {
                i += 1;
                if (i < items.length) {
                  var filepath = items[i];
                  var p = relativePath(localPath2, filepath).split("\\").join("/");
                  p = p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
                  if (filter(p)) {
                    filetools.fs.stat(filepath, function(er0, stats) {
                      if (er0) callback(void 0, er0);
                      if (stats.isFile()) {
                        filetools.fs.readFile(filepath, function(er1, data) {
                          if (er1) {
                            callback(void 0, er1);
                          } else {
                            self.addFile(zipPath + p, data, "", stats);
                            next();
                          }
                        });
                      } else {
                        self.addFile(zipPath + p + "/", Buffer.alloc(0), "", stats);
                        next();
                      }
                    });
                  } else {
                    process.nextTick(() => {
                      next();
                    });
                  }
                } else {
                  callback(true, void 0);
                }
              };
              next();
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {object | string} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the folder.
         * @param {string} [options.zipPath] - optional path inside zip.
         * @param {RegExp|function} [options.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [options.namefix] - optional function to help fix filename
         * @param {doneCallback} callback - The callback that handles the response.
         *
         */
        addLocalFolderAsync2: function(options2, callback) {
          const self = this;
          options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
          localPath = pth.resolve(fixPath(options2.localPath));
          let { zipPath, filter, namefix } = options2;
          if (filter instanceof RegExp) {
            filter = /* @__PURE__ */ (function(rx) {
              return function(filename) {
                return rx.test(filename);
              };
            })(filter);
          } else if ("function" !== typeof filter) {
            filter = function() {
              return true;
            };
          }
          zipPath = zipPath ? fixPath(zipPath) : "";
          if (namefix == "latin1") {
            namefix = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
          }
          if (typeof namefix !== "function") namefix = (str) => str;
          const relPathFix = (entry) => pth.join(zipPath, namefix(relativePath(localPath, entry)));
          const fileNameFix = (entry) => pth.win32.basename(pth.win32.normalize(namefix(entry)));
          filetools.fs.open(localPath, "r", function(err) {
            if (err && err.code === "ENOENT") {
              callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath));
            } else if (err) {
              callback(void 0, err);
            } else {
              filetools.findFilesAsync(localPath, function(err2, fileEntries) {
                if (err2) return callback(err2);
                fileEntries = fileEntries.filter((dir) => filter(relPathFix(dir)));
                if (!fileEntries.length) callback(void 0, false);
                setImmediate(
                  fileEntries.reverse().reduce(function(next, entry) {
                    return function(err3, done) {
                      if (err3 || done === false) return setImmediate(next, err3, false);
                      self.addLocalFileAsync(
                        {
                          localPath: entry,
                          zipPath: pth.dirname(relPathFix(entry)),
                          zipName: fileNameFix(entry)
                        },
                        next
                      );
                    };
                  }, callback)
                );
              });
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - path where files will be extracted
         * @param {object} props - optional properties
         * @param {string} [props.zipPath] - optional path inside zip
         * @param {RegExp|function} [props.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [props.namefix] - optional function to help fix filename
         */
        addLocalFolderPromise: function(localPath2, props) {
          return new Promise((resolve, reject) => {
            this.addLocalFolderAsync2(Object.assign({ localPath: localPath2 }, props), (err, done) => {
              if (err) reject(err);
              if (done) resolve(this);
            });
          });
        },
        /**
         * Allows you to create a entry (file or directory) in the zip file.
         * If you want to create a directory the entryName must end in / and a null buffer should be provided.
         * Comment and attributes are optional
         *
         * @param {string} entryName
         * @param {Buffer | string} content - file content as buffer or utf8 coded string
         * @param {string} [comment] - file comment
         * @param {number | object} [attr] - number as unix file permissions, object as filesystem Stats object
         */
        addFile: function(entryName, content, comment, attr) {
          entryName = zipnamefix(entryName);
          let entry = getEntry(entryName);
          const update = entry != null;
          if (!update) {
            entry = new ZipEntry(opts);
            entry.entryName = entryName;
          }
          entry.comment = comment || "";
          const isStat = "object" === typeof attr && attr instanceof filetools.fs.Stats;
          if (isStat) {
            entry.header.time = attr.mtime;
          }
          var fileattr = entry.isDirectory ? 16 : 0;
          let unix = entry.isDirectory ? 16384 : 32768;
          if (isStat) {
            unix |= 4095 & attr.mode;
          } else if ("number" === typeof attr) {
            unix |= 4095 & attr;
          } else {
            unix |= entry.isDirectory ? 493 : 420;
          }
          fileattr = (fileattr | unix << 16) >>> 0;
          entry.attr = fileattr;
          entry.setData(content);
          if (!update) _zip.setEntry(entry);
          return entry;
        },
        /**
         * Returns an array of ZipEntry objects representing the files and folders inside the archive
         *
         * @param {string} [password]
         * @returns Array
         */
        getEntries: function(password) {
          _zip.password = password;
          return _zip ? _zip.entries : [];
        },
        /**
         * Returns a ZipEntry object representing the file or folder specified by ``name``.
         *
         * @param {string} name
         * @return ZipEntry
         */
        getEntry: function(name) {
          return getEntry(name);
        },
        getEntryCount: function() {
          return _zip.getEntryCount();
        },
        forEach: function(callback) {
          return _zip.forEach(callback);
        },
        /**
         * Extracts the given entry to the given targetPath
         * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
         *
         * @param {string|ZipEntry} entry - ZipEntry object or String with the full path of the entry
         * @param {string} targetPath - Target folder where to write the file
         * @param {boolean} [maintainEntryPath=true] - If maintainEntryPath is true and the entry is inside a folder, the entry folder will be created in targetPath as well. Default is TRUE
         * @param {boolean} [overwrite=false] - If the file already exists at the target path, the file will be overwriten if this is true.
         * @param {boolean} [keepOriginalPermission=false] - The file will be set as the permission from the entry if this is true.
         * @param {string} [outFileName] - String If set will override the filename of the extracted file (Only works if the entry is a file)
         *
         * @return Boolean
         */
        extractEntryTo: function(entry, targetPath, maintainEntryPath, overwrite, keepOriginalPermission, outFileName) {
          overwrite = get_Bool(false, overwrite);
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          maintainEntryPath = get_Bool(true, maintainEntryPath);
          outFileName = get_Str(keepOriginalPermission, outFileName);
          var item = getEntry(entry);
          if (!item) {
            throw Utils.Errors.NO_ENTRY();
          }
          var entryName = canonical(item.entryName);
          var target = sanitize(targetPath, outFileName && !item.isDirectory ? outFileName : maintainEntryPath ? entryName : pth.basename(entryName));
          if (item.isDirectory) {
            var children = _zip.getEntryChildren(item);
            children.forEach(function(child) {
              if (child.isDirectory) return;
              var content2 = child.getData();
              if (!content2) {
                throw Utils.Errors.CANT_EXTRACT_FILE();
              }
              var name = canonical(child.entryName);
              var childName = sanitize(targetPath, maintainEntryPath ? name : pth.basename(name));
              const fileAttr2 = keepOriginalPermission ? child.header.fileAttr : void 0;
              filetools.writeFileTo(childName, content2, overwrite, fileAttr2);
            });
            return true;
          }
          var content = item.getData(_zip.password);
          if (!content) throw Utils.Errors.CANT_EXTRACT_FILE();
          if (filetools.fs.existsSync(target) && !overwrite) {
            throw Utils.Errors.CANT_OVERRIDE();
          }
          const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
          filetools.writeFileTo(target, content, overwrite, fileAttr);
          return true;
        },
        /**
         * Test the archive
         * @param {string} [pass]
         */
        test: function(pass) {
          if (!_zip) {
            return false;
          }
          for (var entry in _zip.entries) {
            try {
              if (entry.isDirectory) {
                continue;
              }
              var content = _zip.entries[entry].getData(pass);
              if (!content) {
                return false;
              }
            } catch (err) {
              return false;
            }
          }
          return true;
        },
        /**
         * Extracts the entire archive to the given location
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {string|Buffer} [pass] password
         */
        extractAllTo: function(targetPath, overwrite, keepOriginalPermission, pass) {
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          pass = get_Str(keepOriginalPermission, pass);
          overwrite = get_Bool(false, overwrite);
          if (!_zip) throw Utils.Errors.NO_ZIP();
          _zip.entries.forEach(function(entry) {
            var entryName = sanitize(targetPath, canonical(entry.entryName));
            if (entry.isDirectory) {
              filetools.makeDir(entryName);
              return;
            }
            var content = entry.getData(pass);
            if (!content) {
              throw Utils.Errors.CANT_EXTRACT_FILE();
            }
            const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            filetools.writeFileTo(entryName, content, overwrite, fileAttr);
            try {
              filetools.fs.utimesSync(entryName, entry.header.time, entry.header.time);
            } catch (err) {
              throw Utils.Errors.CANT_EXTRACT_FILE();
            }
          });
        },
        /**
         * Asynchronous extractAllTo
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {function} callback The callback will be executed when all entries are extracted successfully or any error is thrown.
         */
        extractAllToAsync: function(targetPath, overwrite, keepOriginalPermission, callback) {
          callback = get_Fun(overwrite, keepOriginalPermission, callback);
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          overwrite = get_Bool(false, overwrite);
          if (!callback) {
            return new Promise((resolve, reject) => {
              this.extractAllToAsync(targetPath, overwrite, keepOriginalPermission, function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve(this);
                }
              });
            });
          }
          if (!_zip) {
            callback(Utils.Errors.NO_ZIP());
            return;
          }
          targetPath = pth.resolve(targetPath);
          const getPath = (entry) => sanitize(targetPath, pth.normalize(canonical(entry.entryName)));
          const getError = (msg, file) => new Error(msg + ': "' + file + '"');
          const dirEntries = [];
          const fileEntries = [];
          _zip.entries.forEach((e) => {
            if (e.isDirectory) {
              dirEntries.push(e);
            } else {
              fileEntries.push(e);
            }
          });
          for (const entry of dirEntries) {
            const dirPath = getPath(entry);
            const dirAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            try {
              filetools.makeDir(dirPath);
              if (dirAttr) filetools.fs.chmodSync(dirPath, dirAttr);
              filetools.fs.utimesSync(dirPath, entry.header.time, entry.header.time);
            } catch (er) {
              callback(getError("Unable to create folder", dirPath));
            }
          }
          fileEntries.reverse().reduce(function(next, entry) {
            return function(err) {
              if (err) {
                next(err);
              } else {
                const entryName = pth.normalize(canonical(entry.entryName));
                const filePath = sanitize(targetPath, entryName);
                entry.getDataAsync(function(content, err_1) {
                  if (err_1) {
                    next(err_1);
                  } else if (!content) {
                    next(Utils.Errors.CANT_EXTRACT_FILE());
                  } else {
                    const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
                    filetools.writeFileToAsync(filePath, content, overwrite, fileAttr, function(succ) {
                      if (!succ) {
                        next(getError("Unable to write file", filePath));
                      }
                      filetools.fs.utimes(filePath, entry.header.time, entry.header.time, function(err_2) {
                        if (err_2) {
                          next(getError("Unable to set times", filePath));
                        } else {
                          next();
                        }
                      });
                    });
                  }
                });
              }
            };
          }, callback)();
        },
        /**
         * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
         *
         * @param {string} targetFileName
         * @param {function} callback
         */
        writeZip: function(targetFileName, callback) {
          if (arguments.length === 1) {
            if (typeof targetFileName === "function") {
              callback = targetFileName;
              targetFileName = "";
            }
          }
          if (!targetFileName && opts.filename) {
            targetFileName = opts.filename;
          }
          if (!targetFileName) return;
          var zipData = _zip.compressToBuffer();
          if (zipData) {
            var ok = filetools.writeFileTo(targetFileName, zipData, true);
            if (typeof callback === "function") callback(!ok ? new Error("failed") : null, "");
          }
        },
        /**
                 *
                 * @param {string} targetFileName
                 * @param {object} [props]
                 * @param {boolean} [props.overwrite=true] If the file already exists at the target path, the file will be overwriten if this is true.
                 * @param {boolean} [props.perm] The file will be set as the permission from the entry if this is true.
        
                 * @returns {Promise<void>}
                 */
        writeZipPromise: function(targetFileName, props) {
          const { overwrite, perm } = Object.assign({ overwrite: true }, props);
          return new Promise((resolve, reject) => {
            if (!targetFileName && opts.filename) targetFileName = opts.filename;
            if (!targetFileName) reject("ADM-ZIP: ZIP File Name Missing");
            this.toBufferPromise().then((zipData) => {
              const ret = (done) => done ? resolve(done) : reject("ADM-ZIP: Wasn't able to write zip file");
              filetools.writeFileToAsync(targetFileName, zipData, overwrite, perm, ret);
            }, reject);
          });
        },
        /**
         * @returns {Promise<Buffer>} A promise to the Buffer.
         */
        toBufferPromise: function() {
          return new Promise((resolve, reject) => {
            _zip.toAsyncBuffer(resolve, reject);
          });
        },
        /**
         * Returns the content of the entire zip file as a Buffer object
         *
         * @prop {function} [onSuccess]
         * @prop {function} [onFail]
         * @prop {function} [onItemStart]
         * @prop {function} [onItemEnd]
         * @returns {Buffer}
         */
        toBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          if (typeof onSuccess === "function") {
            _zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd);
            return null;
          }
          return _zip.compressToBuffer();
        }
      };
    };
  }
});

// electron/main.ts
var import_electron5 = require("electron");
var import_node_path = __toESM(require("node:path"), 1);

// electron/handlers/Logger.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var PersistentLogger = class {
  logsDir;
  launcherLogPath;
  gameLogPath;
  initialized = false;
  MAX_LOG_DAYS = 7;
  constructor() {
    this.logsDir = "";
    this.launcherLogPath = "";
    this.gameLogPath = "";
  }
  /**
   * Initialize the logger. Must be called after app is ready.
   */
  init() {
    if (this.initialized) return;
    this.logsDir = import_path.default.join(import_electron.app.getPath("userData"), "logs");
    import_fs.default.mkdirSync(this.logsDir, { recursive: true });
    const dateStr = this.getDateString();
    this.launcherLogPath = import_path.default.join(this.logsDir, `launcher-${dateStr}.log`);
    this.gameLogPath = import_path.default.join(this.logsDir, `game-${dateStr}.log`);
    this.rotateOldLogs();
    this.interceptConsole();
    this.initialized = true;
    this.info("Logger", "=== BlockyCRAFT Launcher Log Started ===");
    this.info("Logger", `Log file: ${this.launcherLogPath}`);
  }
  /**
   * Gets current date string in YYYY-MM-DD format
   */
  getDateString() {
    const now = /* @__PURE__ */ new Date();
    return now.toISOString().split("T")[0];
  }
  /**
   * Gets current timestamp in ISO format
   */
  getTimestamp() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  /**
   * Formats a log message with timestamp and level
   */
  formatMessage(level, tag, message) {
    return `[${this.getTimestamp()}] [${level}] [${tag}] ${message}`;
  }
  /**
   * Writes a line to the launcher log file
   */
  writeToLauncherLog(line) {
    if (!this.initialized) return;
    try {
      import_fs.default.appendFileSync(this.launcherLogPath, line + "\n");
    } catch (e) {
      process.stdout.write(`[LOG WRITE ERROR] ${e}
`);
    }
  }
  /**
   * Writes a line to the game log file
   */
  writeToGameLog(line) {
    if (!this.initialized) return;
    try {
      import_fs.default.appendFileSync(this.gameLogPath, `[${this.getTimestamp()}] ${line}
`);
    } catch (e) {
      process.stdout.write(`[GAME LOG WRITE ERROR] ${e}
`);
    }
  }
  /**
   * Removes log files older than MAX_LOG_DAYS
   */
  rotateOldLogs() {
    try {
      const files = import_fs.default.readdirSync(this.logsDir);
      const now = Date.now();
      const maxAge = this.MAX_LOG_DAYS * 24 * 60 * 60 * 1e3;
      for (const file of files) {
        if (!file.endsWith(".log")) continue;
        const filePath = import_path.default.join(this.logsDir, file);
        const stats = import_fs.default.statSync(filePath);
        const age = now - stats.mtimeMs;
        if (age > maxAge) {
          import_fs.default.unlinkSync(filePath);
          process.stdout.write(`[Logger] Deleted old log: ${file}
`);
        }
      }
    } catch (e) {
      process.stdout.write(`[Logger] Error rotating logs: ${e}
`);
    }
  }
  /**
   * Intercepts console.log, console.error, console.warn
   */
  interceptConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const self = this;
    console.log = function(...args) {
      const message = args.map((a) => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ");
      self.writeToLauncherLog(self.formatMessage("INFO", "Console", message));
      originalLog.apply(console, args);
    };
    console.error = function(...args) {
      const message = args.map((a) => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ");
      self.writeToLauncherLog(self.formatMessage("ERROR", "Console", message));
      originalError.apply(console, args);
    };
    console.warn = function(...args) {
      const message = args.map((a) => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ");
      self.writeToLauncherLog(self.formatMessage("WARN", "Console", message));
      originalWarn.apply(console, args);
    };
  }
  // Public logging methods with tags
  info(tag, message) {
    const formatted = this.formatMessage("INFO", tag, message);
    this.writeToLauncherLog(formatted);
    process.stdout.write(formatted + "\n");
  }
  error(tag, message) {
    const formatted = this.formatMessage("ERROR", tag, message);
    this.writeToLauncherLog(formatted);
    process.stderr.write(formatted + "\n");
  }
  warn(tag, message) {
    const formatted = this.formatMessage("WARN", tag, message);
    this.writeToLauncherLog(formatted);
    process.stdout.write(formatted + "\n");
  }
  debug(tag, message) {
    const formatted = this.formatMessage("DEBUG", tag, message);
    this.writeToLauncherLog(formatted);
  }
  /**
   * Logs game output (stdout/stderr) to game log file
   */
  game(stream, line) {
    const prefix = stream === "stderr" ? "[ERR]" : "[OUT]";
    this.writeToGameLog(`${prefix} ${line}`);
  }
  /**
   * Returns the path to the logs directory
   */
  getLogsDir() {
    return this.logsDir;
  }
};
var Logger = new PersistentLogger();

// electron/handlers/GameHandler.ts
var import_electron4 = require("electron");
var import_path4 = __toESM(require("path"), 1);
var import_fs6 = __toESM(require("fs"), 1);
var import_child_process2 = require("child_process");
var import_util2 = require("util");
var import_adm_zip3 = __toESM(require_adm_zip(), 1);
var import_fs7 = require("fs");

// electron/handlers/JavaManager.ts
var import_electron2 = require("electron");
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_fs3 = require("fs");
var import_child_process = require("child_process");
var import_util = require("util");
var import_adm_zip = __toESM(require_adm_zip(), 1);
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var ADOPTIUM_API_BASE = "https://api.adoptium.net/v3/binary/latest";
var JAVA_VERSION = "17";
var JVM_IMPL = "hotspot";
var VENDOR = "eclipse";
var JavaManager = class {
  javaDir;
  markerFile;
  constructor() {
    this.javaDir = import_path2.default.join(import_electron2.app.getPath("userData"), "java");
    this.markerFile = import_path2.default.join(this.javaDir, ".java17_installed");
  }
  /**
   * Ensures Java 17 is available, downloading it if necessary.
   * Returns the path to the java executable.
   */
  async ensureJava(sender) {
    const localJavaPath = this.getLocalJavaPath();
    if (localJavaPath && import_fs2.default.existsSync(localJavaPath)) {
      console.log("[JavaManager] Using locally installed Java:", localJavaPath);
      return localJavaPath;
    }
    const systemJava = await this.detectSystemJava();
    if (systemJava) {
      console.log("[JavaManager] Using system Java:", systemJava);
      return systemJava;
    }
    console.log("[JavaManager] No Java found, downloading...");
    return this.downloadAndInstallJava(sender);
  }
  /**
   * Detects if Java 17+ is available on the system PATH or common locations.
   */
  async detectSystemJava() {
    const javaPaths = this.getCommonJavaPaths();
    for (const javaPath of javaPaths) {
      if (await this.isValidJava17(javaPath)) {
        return javaPath;
      }
    }
    return null;
  }
  /**
   * Returns common Java installation paths based on OS.
   */
  getCommonJavaPaths() {
    const paths = ["java"];
    const platform = process.platform;
    if (platform === "win32") {
      const programFiles = process.env["ProgramFiles"] || "C:\\Program Files";
      const programFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
      paths.push(
        import_path2.default.join(programFiles, "Eclipse Adoptium", "jdk-17*", "bin", "java.exe"),
        import_path2.default.join(programFiles, "Java", "jdk-17*", "bin", "java.exe"),
        import_path2.default.join(programFiles, "Java", "jre-17*", "bin", "java.exe"),
        import_path2.default.join(programFiles, "Temurin", "jdk-17*", "bin", "java.exe"),
        import_path2.default.join(programFilesX86, "Java", "jdk-17*", "bin", "java.exe")
      );
    } else if (platform === "darwin") {
      paths.push(
        "/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java",
        "/Library/Java/JavaVirtualMachines/adoptopenjdk-17.jdk/Contents/Home/bin/java",
        "/usr/local/opt/openjdk@17/bin/java",
        "/opt/homebrew/opt/openjdk@17/bin/java"
      );
    } else {
      paths.push(
        "/usr/lib/jvm/temurin-17-jdk/bin/java",
        "/usr/lib/jvm/java-17-openjdk/bin/java",
        "/usr/lib/jvm/java-17-openjdk-amd64/bin/java",
        "/usr/lib/jvm/java-17-temurin/bin/java",
        "/opt/java/openjdk/bin/java"
      );
    }
    return paths;
  }
  /**
   * Checks if the given Java path is valid and is Java 17+.
   */
  async isValidJava17(javaPath) {
    try {
      const { stdout, stderr } = await execAsync(`"${javaPath}" -version`);
      const output = stdout + stderr;
      const versionMatch = output.match(/version "(\d+)/);
      if (versionMatch) {
        const majorVersion = parseInt(versionMatch[1], 10);
        return majorVersion >= 17;
      }
      return false;
    } catch {
      return false;
    }
  }
  /**
   * Gets platform info for Adoptium API.
   */
  getPlatformInfo() {
    const platform = process.platform;
    const arch = process.arch;
    let os;
    let extension;
    let executablePath;
    switch (platform) {
      case "win32":
        os = "windows";
        extension = "zip";
        executablePath = "bin/java.exe";
        break;
      case "darwin":
        os = "mac";
        extension = "tar.gz";
        executablePath = "Contents/Home/bin/java";
        break;
      default:
        os = "linux";
        extension = "tar.gz";
        executablePath = "bin/java";
    }
    let archStr;
    switch (arch) {
      case "arm64":
        archStr = "aarch64";
        break;
      case "x64":
      default:
        archStr = "x64";
    }
    return { os, arch: archStr, extension, executablePath };
  }
  /**
   * Gets the download URL for Adoptium JRE 17.
   */
  getDownloadUrl() {
    const info = this.getPlatformInfo();
    const url = `${ADOPTIUM_API_BASE}/${JAVA_VERSION}/ga/${info.os}/${info.arch}/jre/${JVM_IMPL}/normal/${VENDOR}`;
    const filename = `temurin-17-jre.${info.extension}`;
    return { url, filename };
  }
  /**
   * Gets the path to the locally installed Java executable.
   */
  getLocalJavaPath() {
    if (!import_fs2.default.existsSync(this.markerFile)) {
      return null;
    }
    const info = this.getPlatformInfo();
    if (!import_fs2.default.existsSync(this.javaDir)) {
      return null;
    }
    const entries = import_fs2.default.readdirSync(this.javaDir);
    const jreDir = entries.find(
      (e) => e.startsWith("jdk-17") && import_fs2.default.statSync(import_path2.default.join(this.javaDir, e)).isDirectory()
    );
    if (!jreDir) {
      return null;
    }
    const javaPath = import_path2.default.join(this.javaDir, jreDir, info.executablePath);
    if (import_fs2.default.existsSync(javaPath)) {
      return javaPath;
    }
    return null;
  }
  /**
   * Downloads and installs Java 17 JRE.
   */
  async downloadAndInstallJava(sender) {
    const { url, filename } = this.getDownloadUrl();
    const info = this.getPlatformInfo();
    import_fs2.default.mkdirSync(this.javaDir, { recursive: true });
    const archivePath = import_path2.default.join(this.javaDir, filename);
    this.sendProgress(sender, "Baixando Java 17...", 0);
    console.log("[JavaManager] Downloading from:", url);
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (!response.ok) {
        throw new Error(`Failed to download Java: ${response.status} ${response.statusText}`);
      }
      const total = Number(response.headers.get("content-length")) || 0;
      const fileStream = (0, import_fs3.createWriteStream)(archivePath);
      if (!response.body) {
        throw new Error("No response body");
      }
      const reader = response.body.getReader();
      let downloaded = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fileStream.write(Buffer.from(value));
        downloaded += value.length;
        if (total > 0) {
          const percent = Math.round(downloaded / total * 50);
          this.sendProgress(sender, `Baixando Java 17... (${this.formatSize(downloaded)}/${this.formatSize(total)})`, percent);
        }
      }
      fileStream.end();
      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });
      console.log("[JavaManager] Download complete:", archivePath);
    } catch (e) {
      if (import_fs2.default.existsSync(archivePath)) {
        import_fs2.default.unlinkSync(archivePath);
      }
      throw new Error(`Failed to download Java: ${e.message}`);
    }
    this.sendProgress(sender, "Extraindo Java 17...", 55);
    console.log("[JavaManager] Extracting...");
    try {
      if (info.extension === "zip") {
        const zip = new import_adm_zip.default(archivePath);
        zip.extractAllTo(this.javaDir, true);
      } else {
        await execAsync(`tar -xzf "${archivePath}" -C "${this.javaDir}"`);
      }
      import_fs2.default.writeFileSync(this.markerFile, (/* @__PURE__ */ new Date()).toISOString());
      import_fs2.default.unlinkSync(archivePath);
    } catch (e) {
      throw new Error(`Failed to extract Java: ${e.message}`);
    }
    const javaPath = this.getLocalJavaPath();
    if (!javaPath) {
      throw new Error("Java extraction failed: executable not found");
    }
    if (process.platform !== "win32") {
      await execAsync(`chmod +x "${javaPath}"`);
    }
    this.sendProgress(sender, "Java 17 instalado!", 60);
    console.log("[JavaManager] Java installed at:", javaPath);
    return javaPath;
  }
  /**
   * Sends progress update to the renderer.
   */
  sendProgress(sender, status, progress) {
    if (sender) {
      sender.send("launch-progress", { status, progress });
    }
  }
  /**
   * Formats bytes to human-readable size.
   */
  formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
};

// electron/handlers/UpdateManager.ts
var import_electron3 = require("electron");
var import_path3 = __toESM(require("path"), 1);
var import_fs4 = __toESM(require("fs"), 1);
var import_fs5 = require("fs");
var import_adm_zip2 = __toESM(require_adm_zip(), 1);
var VERSION_JSON_URLS = [
  "https://craft.blocky.com.br/launcher-assets/version.json"
];
var UpdateManager = class {
  dataPath;
  localVersionsPath;
  instanceDir;
  librariesDir;
  constructor() {
    this.dataPath = import_electron3.app.getPath("userData");
    this.localVersionsPath = import_path3.default.join(this.dataPath, "versions.json");
    this.instanceDir = import_path3.default.join(this.dataPath, "instances", "default");
    this.librariesDir = import_path3.default.join(this.instanceDir, "libraries");
  }
  /**
   * Normalizes URL to array format
   */
  normalizeUrls(urlOrUrls) {
    if (Array.isArray(urlOrUrls)) {
      return urlOrUrls;
    }
    return [urlOrUrls];
  }
  /**
   * Gets local version info, creating default if it doesn't exist
   */
  getLocalVersions() {
    try {
      if (import_fs4.default.existsSync(this.localVersionsPath)) {
        const content = import_fs4.default.readFileSync(this.localVersionsPath, "utf-8");
        return JSON.parse(content);
      }
    } catch (e) {
      console.error("[UpdateManager] Failed to read local versions:", e);
    }
    return {
      instance: "0.0.0",
      libraries: "0.0.0",
      mods: "0.0.0"
    };
  }
  /**
   * Saves local version info
   */
  saveLocalVersions(versions) {
    try {
      import_fs4.default.writeFileSync(this.localVersionsPath, JSON.stringify(versions, null, 2));
      console.log("[UpdateManager] Saved local versions:", versions);
    } catch (e) {
      console.error("[UpdateManager] Failed to save local versions:", e);
    }
  }
  /**
   * Fetches remote version info from VPS with fallback support
   */
  async fetchRemoteVersions() {
    for (const url of VERSION_JSON_URLS) {
      try {
        console.log("[UpdateManager] Trying to fetch versions from:", url);
        const response = await fetch(url, {
          signal: AbortSignal.timeout(1e4)
          // 10 second timeout
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("[UpdateManager] Successfully fetched from:", url);
        console.log("[UpdateManager] Remote versions:", data);
        return data;
      } catch (e) {
        console.warn(`[UpdateManager] Failed to fetch from ${url}:`, e);
      }
    }
    console.error("[UpdateManager] All version URLs failed");
    return null;
  }
  /**
   * Checks what updates are available
   */
  async checkForUpdates() {
    const localVersions = this.getLocalVersions();
    const remoteVersions = await this.fetchRemoteVersions();
    if (!remoteVersions) {
      return {
        instanceUpdate: false,
        librariesUpdate: false,
        modsUpdate: false,
        remoteVersions: null,
        error: "Failed to fetch remote version info"
      };
    }
    const instanceUpdate = remoteVersions.instance.version !== localVersions.instance;
    const librariesUpdate = false;
    const modsUpdate = remoteVersions.mods ? remoteVersions.mods.version !== localVersions.mods : false;
    console.log("[UpdateManager] Update check result:", {
      instanceUpdate,
      librariesUpdate: "DISABLED (Maven-based)",
      modsUpdate,
      local: localVersions,
      remote: {
        instance: remoteVersions.instance.version,
        libraries: remoteVersions.libraries?.version ?? "N/A (Maven-based)",
        mods: remoteVersions.mods?.version
      }
    });
    return {
      instanceUpdate,
      librariesUpdate,
      modsUpdate,
      remoteVersions
    };
  }
  /**
   * Downloads a file with progress reporting and multi-URL fallback support
   */
  async downloadFile(urlOrUrls, destPath, progressCallback) {
    const filename = import_path3.default.basename(destPath);
    progressCallback?.(`Baixando ${filename}...`, 0);
    const urls = this.normalizeUrls(urlOrUrls);
    let lastError = null;
    for (let i = 0; i < urls.length; i++) {
      const tryUrl = urls[i];
      try {
        console.log(`[UpdateManager] Downloading from URL ${i + 1}/${urls.length}: ${tryUrl}`);
        const response = await fetch(tryUrl, {
          signal: AbortSignal.timeout(6e4)
          // 60 second timeout for downloads
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const total = Number(response.headers.get("content-length")) || 0;
        import_fs4.default.mkdirSync(import_path3.default.dirname(destPath), { recursive: true });
        const fileStream = (0, import_fs5.createWriteStream)(destPath);
        if (!response.body) {
          throw new Error("No response body");
        }
        const reader = response.body.getReader();
        let downloaded = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fileStream.write(Buffer.from(value));
          downloaded += value.length;
          if (total > 0) {
            const percent = Math.round(downloaded / total * 100);
            progressCallback?.(`Baixando ${filename}...`, percent);
          }
        }
        fileStream.end();
        await new Promise((resolve, reject) => {
          fileStream.on("finish", resolve);
          fileStream.on("error", reject);
        });
        console.log(`[UpdateManager] Downloaded ${filename} (${this.formatSize(downloaded)}) from ${tryUrl}`);
        return;
      } catch (e) {
        console.warn(`[UpdateManager] Failed to download from ${tryUrl}:`, e.message);
        lastError = e;
      }
    }
    throw lastError || new Error(`Failed to download ${filename} from all ${urls.length} sources`);
  }
  /**
   * Extracts a zip file to a directory
   */
  extractZip(zipPath, destDir) {
    console.log(`[UpdateManager] Extracting ${zipPath} to ${destDir}`);
    if (!import_fs4.default.existsSync(zipPath)) {
      throw new Error(`ZIP file not found: ${zipPath}`);
    }
    const fileBuffer = import_fs4.default.readFileSync(zipPath);
    if (fileBuffer.length < 4 || fileBuffer[0] !== 80 || fileBuffer[1] !== 75) {
      console.error(`[UpdateManager] Invalid ZIP file. First bytes: ${fileBuffer.slice(0, 20).toString("hex")}`);
      throw new Error(`Invalid ZIP file: ${zipPath}. The download may have failed or returned an error page.`);
    }
    import_fs4.default.mkdirSync(destDir, { recursive: true });
    const zip = new import_adm_zip2.default(zipPath);
    zip.extractAllTo(destDir, true);
    console.log(`[UpdateManager] Extraction complete`);
  }
  /**
   * Backs up user data before update
   */
  backupUserData() {
    const backupDir = import_path3.default.join(this.dataPath, "update_backup");
    const dotMinecraft = import_path3.default.join(this.instanceDir, ".minecraft");
    if (import_fs4.default.existsSync(backupDir)) {
      import_fs4.default.rmSync(backupDir, { recursive: true, force: true });
    }
    import_fs4.default.mkdirSync(backupDir, { recursive: true });
    const itemsToBackup = [
      "options.txt",
      "servers.dat",
      "screenshots",
      "stats",
      "lastlogin",
      // Some old versions use this
      "config"
      // Mod configs
    ];
    console.log("[UpdateManager] Backing up user data...");
    for (const item of itemsToBackup) {
      const src = import_path3.default.join(dotMinecraft, item);
      const dest = import_path3.default.join(backupDir, item);
      if (import_fs4.default.existsSync(src)) {
        try {
          console.log(`[UpdateManager] Backing up: ${item}`);
          import_fs4.default.cpSync(src, dest, { recursive: true });
        } catch (e) {
          console.warn(`[UpdateManager] Failed to backup ${item}:`, e);
        }
      }
    }
  }
  /**
   * Restores user data after update
   */
  restoreUserData() {
    const backupDir = import_path3.default.join(this.dataPath, "update_backup");
    const dotMinecraft = import_path3.default.join(this.instanceDir, ".minecraft");
    if (!import_fs4.default.existsSync(backupDir)) return;
    console.log("[UpdateManager] Restoring user data...");
    const items = import_fs4.default.readdirSync(backupDir);
    for (const item of items) {
      const src = import_path3.default.join(backupDir, item);
      const dest = import_path3.default.join(dotMinecraft, item);
      try {
        console.log(`[UpdateManager] Restoring: ${item}`);
        if (import_fs4.default.existsSync(dest)) {
          import_fs4.default.rmSync(dest, { recursive: true, force: true });
        }
        import_fs4.default.cpSync(src, dest, { recursive: true });
      } catch (e) {
        console.warn(`[UpdateManager] Failed to restore ${item}:`, e);
      }
    }
    try {
      import_fs4.default.rmSync(backupDir, { recursive: true, force: true });
    } catch (e) {
      console.warn("[UpdateManager] Failed to cleanup backup:", e);
    }
  }
  /**
   * Performs instance update
   */
  async updateInstance(remoteVersions, progressCallback) {
    const tempZip = import_path3.default.join(this.dataPath, "temp_instance.zip");
    try {
      await this.downloadFile(remoteVersions.instance.url, tempZip, progressCallback);
      progressCallback?.("Preparando atualiza\xE7\xE3o da inst\xE2ncia...", 0);
      this.backupUserData();
      if (import_fs4.default.existsSync(this.instanceDir)) {
      }
      progressCallback?.("Extraindo inst\xE2ncia...", 50);
      this.extractZip(tempZip, this.instanceDir);
      this.restoreUserData();
      const localVersions = this.getLocalVersions();
      localVersions.instance = remoteVersions.instance.version;
      this.saveLocalVersions(localVersions);
      progressCallback?.("Inst\xE2ncia atualizada!", 100);
    } finally {
      if (import_fs4.default.existsSync(tempZip)) {
        import_fs4.default.unlinkSync(tempZip);
      }
    }
  }
  /**
   * Performs libraries update
   * @deprecated Libraries are now downloaded from Maven repos directly in GameHandler
   */
  async updateLibraries(remoteVersions, progressCallback) {
    if (!remoteVersions.libraries) {
      console.log("[UpdateManager] Libraries update skipped - using Maven repos");
      return;
    }
    const tempZip = import_path3.default.join(this.dataPath, "temp_libraries.zip");
    try {
      await this.downloadFile(remoteVersions.libraries.url, tempZip, progressCallback);
      progressCallback?.("Preparando atualiza\xE7\xE3o das bibliotecas...", 0);
      const oldMarker = import_path3.default.join(this.librariesDir, ".bundled_extracted_v1");
      if (import_fs4.default.existsSync(oldMarker)) {
        import_fs4.default.unlinkSync(oldMarker);
      }
      if (import_fs4.default.existsSync(this.librariesDir)) {
        import_fs4.default.rmSync(this.librariesDir, { recursive: true, force: true });
      }
      progressCallback?.("Extraindo bibliotecas...", 50);
      this.extractZip(tempZip, this.librariesDir);
      import_fs4.default.writeFileSync(import_path3.default.join(this.librariesDir, ".bundled_extracted_v2"), "extracted");
      const localVersions = this.getLocalVersions();
      localVersions.libraries = remoteVersions.libraries.version;
      this.saveLocalVersions(localVersions);
      progressCallback?.("Bibliotecas atualizadas!", 100);
    } finally {
      if (import_fs4.default.existsSync(tempZip)) {
        import_fs4.default.unlinkSync(tempZip);
      }
    }
  }
  /**
   * Performs mods update
   */
  async updateMods(remoteVersions, progressCallback) {
    if (!remoteVersions.mods) {
      console.log("[UpdateManager] No mods update available");
      return;
    }
    const tempZip = import_path3.default.join(this.dataPath, "temp_mods.zip");
    const modsDir = import_path3.default.join(this.instanceDir, ".minecraft", "mods");
    try {
      await this.downloadFile(remoteVersions.mods.url, tempZip, progressCallback);
      progressCallback?.("Removendo mods antigos...", 0);
      if (import_fs4.default.existsSync(modsDir)) {
        import_fs4.default.rmSync(modsDir, { recursive: true, force: true });
      }
      progressCallback?.("Instalando novos mods...", 50);
      this.extractZip(tempZip, import_path3.default.join(this.instanceDir, ".minecraft"));
      const localVersions = this.getLocalVersions();
      localVersions.mods = remoteVersions.mods.version;
      this.saveLocalVersions(localVersions);
      progressCallback?.("Mods atualizados!", 100);
    } finally {
      if (import_fs4.default.existsSync(tempZip)) {
        import_fs4.default.unlinkSync(tempZip);
      }
    }
  }
  /**
   * Performs all necessary updates
   */
  async performAllUpdates(progressCallback) {
    try {
      progressCallback?.("Verificando atualiza\xE7\xF5es...", 0);
      const updateCheck = await this.checkForUpdates();
      if (!updateCheck.remoteVersions) {
        console.log("[UpdateManager] Could not fetch remote versions, skipping updates");
        return { success: true };
      }
      const totalUpdates = [
        updateCheck.instanceUpdate,
        updateCheck.librariesUpdate,
        updateCheck.modsUpdate
      ].filter(Boolean).length;
      if (totalUpdates === 0) {
        console.log("[UpdateManager] All components are up to date");
        progressCallback?.("Tudo atualizado!", 100);
        return { success: true };
      }
      let currentUpdate = 0;
      if (updateCheck.instanceUpdate) {
        currentUpdate++;
        const baseProgress = (currentUpdate - 1) / totalUpdates * 100;
        const progressRange = 100 / totalUpdates;
        await this.updateInstance(
          updateCheck.remoteVersions,
          (status, percent) => {
            const totalPercent = baseProgress + percent / 100 * progressRange;
            progressCallback?.(status, Math.round(totalPercent));
          }
        );
      }
      if (updateCheck.librariesUpdate) {
        currentUpdate++;
        const baseProgress = (currentUpdate - 1) / totalUpdates * 100;
        const progressRange = 100 / totalUpdates;
        await this.updateLibraries(
          updateCheck.remoteVersions,
          (status, percent) => {
            const totalPercent = baseProgress + percent / 100 * progressRange;
            progressCallback?.(status, Math.round(totalPercent));
          }
        );
      }
      if (updateCheck.modsUpdate) {
        currentUpdate++;
        const baseProgress = (currentUpdate - 1) / totalUpdates * 100;
        const progressRange = 100 / totalUpdates;
        await this.updateMods(
          updateCheck.remoteVersions,
          (status, percent) => {
            const totalPercent = baseProgress + percent / 100 * progressRange;
            progressCallback?.(status, Math.round(totalPercent));
          }
        );
      }
      progressCallback?.("Todas as atualiza\xE7\xF5es conclu\xEDdas!", 100);
      return { success: true };
    } catch (e) {
      console.error("[UpdateManager] Update failed:", e);
      return { success: false, error: e.message };
    }
  }
  /**
   * Format bytes to human readable
   */
  formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
};

// electron/handlers/GameHandler.ts
var execAsync2 = (0, import_util2.promisify)(import_child_process2.exec);
function validateZipFile(zipPath) {
  if (!import_fs6.default.existsSync(zipPath)) return false;
  const buffer = import_fs6.default.readFileSync(zipPath);
  return buffer.length >= 4 && buffer[0] === 80 && buffer[1] === 75;
}
function safeExtractZip(zipPath, destDir) {
  if (!validateZipFile(zipPath)) {
    const buffer = import_fs6.default.existsSync(zipPath) ? import_fs6.default.readFileSync(zipPath) : Buffer.alloc(0);
    console.error(`[GameHandler] Invalid ZIP file: ${zipPath}. First bytes: ${buffer.slice(0, 20).toString("hex")}`);
    throw new Error(`Invalid ZIP file. The download may have failed.`);
  }
  import_fs6.default.mkdirSync(destDir, { recursive: true });
  const zip = new import_adm_zip3.default(zipPath);
  zip.extractAllTo(destDir, true);
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function safeExtractZipWithRetry(zipPath, destDir, maxRetries = 3) {
  const delays = [500, 1e3, 2e3];
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      safeExtractZip(zipPath, destDir);
      return;
    } catch (e) {
      lastError = e;
      if (attempt < maxRetries) {
        const delay = delays[attempt] || 2e3;
        console.warn(`[GameHandler] Extraction failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  throw lastError || new Error(`Failed to extract ${zipPath} after ${maxRetries + 1} attempts`);
}
var VERSION_MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";
var TARGET_VERSION_ID = "b1.7.3";
var GameHandler = class {
  gamePath;
  javaPath;
  javaManager;
  updateManager;
  gameProcess = null;
  // ChildProcess type but avoiding import issues for now if needed, or better explicit.
  constructor() {
    this.gamePath = import_path4.default.join(import_electron4.app.getPath("userData"), "gamedata");
    this.javaPath = "java";
    this.javaManager = new JavaManager();
    this.updateManager = new UpdateManager();
  }
  init() {
    import_electron4.ipcMain.handle("launch-game", async (event, options) => {
      return this.handleLaunch(event, options);
    });
    import_electron4.ipcMain.handle("kill-game", async () => {
      if (this.gameProcess) {
        console.log("Killing game process...");
        this.gameProcess.kill();
        this.gameProcess = null;
        return { success: true };
      }
      return { success: false, error: "No game running" };
    });
    import_electron4.ipcMain.handle("check-custom-instance", async () => {
      const instanceZipPath = import_path4.default.resolve("instance.zip");
      const instanceDir = import_path4.default.join(import_electron4.app.getPath("userData"), "instances", "default", "instance.cfg");
      return import_fs6.default.existsSync(instanceZipPath) || import_fs6.default.existsSync(instanceDir);
    });
    import_electron4.ipcMain.handle("check-update-status", async () => {
      return this.handleUpdateCheck();
    });
    import_electron4.ipcMain.handle("perform-update", async (event) => {
      return this.handlePerformUpdate(event);
    });
  }
  sendProgress(sender, status, progress) {
    sender.send("launch-progress", { status, progress });
  }
  async checkJava(path6) {
    try {
      await execAsync2(`"${path6}" -version`);
      return true;
    } catch (e) {
      return false;
    }
  }
  async checkAndExtractInstance() {
    const instanceDir = import_path4.default.join(import_electron4.app.getPath("userData"), "instances", "default");
    const dataDir = import_electron4.app.getPath("userData");
    if (import_fs6.default.existsSync(import_path4.default.join(instanceDir, "instance.cfg"))) {
      console.log("Instance already exists, skipping extraction.");
      return instanceDir;
    }
    const instanceZip = import_path4.default.join(dataDir, "instance.zip");
    if (!import_fs6.default.existsSync(instanceZip)) {
      console.log("instance.zip not found. Attempting to download from VPS...");
      const vpsUrls = [
        "https://craft.blocky.com.br/launcher-assets/instance.zip"
      ];
      for (const vpsUrl of vpsUrls) {
        try {
          console.log(`Trying to download instance.zip from ${vpsUrl}...`);
          const response = await fetch(vpsUrl, { signal: AbortSignal.timeout(6e4) });
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            if (buffer.length >= 4 && buffer[0] === 80 && buffer[1] === 75) {
              import_fs6.default.writeFileSync(instanceZip, buffer);
              console.log("instance.zip downloaded successfully from", vpsUrl);
              break;
            } else {
              console.warn(`Downloaded content from ${vpsUrl} is not a valid ZIP (got ${buffer.length} bytes, first bytes: ${buffer.slice(0, 20).toString("hex")})`);
            }
          }
        } catch (e) {
          console.warn(`Failed to download instance.zip from ${vpsUrl}:`, e);
        }
      }
    }
    if (import_fs6.default.existsSync(instanceZip) && validateZipFile(instanceZip)) {
      console.log("Extracting instance.zip...");
      safeExtractZip(instanceZip, instanceDir);
      return instanceDir;
    }
    return null;
  }
  async downloadFile(url, dest, filename, sender) {
    this.sendProgress(sender, `Baixando ${filename}...`, 0);
    import_fs6.default.mkdirSync(dest, { recursive: true });
    const filePath = import_path4.default.join(dest, filename);
    try {
      if (import_fs6.default.existsSync(filePath)) {
        return filePath;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
      const total = Number(response.headers.get("content-length")) || 0;
      const fileStream = (0, import_fs7.createWriteStream)(filePath);
      if (!response.body) throw new Error("No body");
      const reader = response.body.getReader();
      let downloaded = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fileStream.write(Buffer.from(value));
        downloaded += value.length;
        if (total > 0) {
          this.sendProgress(sender, `Baixando ${filename}`, Math.round(downloaded / total * 100));
        }
      }
      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
        fileStream.end();
      });
      const stats = import_fs6.default.statSync(filePath);
      if (filename.endsWith(".jar") && stats.size < 100) {
        import_fs6.default.unlinkSync(filePath);
        throw new Error(`Downloaded file ${filename} is too small (${stats.size} bytes). Likely invalid.`);
      }
      if (filename.endsWith(".zip") && !validateZipFile(filePath)) {
        const buffer = import_fs6.default.readFileSync(filePath);
        const firstBytes = buffer.slice(0, 20).toString("hex");
        import_fs6.default.unlinkSync(filePath);
        throw new Error(`Downloaded file ${filename} is not a valid ZIP (first bytes: ${firstBytes}). Server may have returned an error page.`);
      }
      return filePath;
    } catch (e) {
      if (import_fs6.default.existsSync(filePath)) {
        try {
          import_fs6.default.unlinkSync(filePath);
        } catch (delErr) {
        }
      }
      throw new Error(`Download failed: ${e}`);
    }
  }
  async handleLaunch(event, options) {
    console.log("Requesting game launch...", options);
    this.sendProgress(event.sender, "Verificando atualiza\xE7\xF5es...", 2);
    try {
      const updateResult = await this.updateManager.performAllUpdates((status, percent) => {
        const mappedPercent = 2 + percent / 100 * 13;
        this.sendProgress(event.sender, status, Math.round(mappedPercent));
      });
      if (!updateResult.success) {
        console.warn("Update check failed, continuing anyway:", updateResult.error);
      }
    } catch (e) {
      console.warn("Update check failed, continuing anyway:", e);
    }
    const instanceDir = await this.checkAndExtractInstance();
    const isCustomInstance = !!instanceDir;
    const gameRoot = instanceDir || this.gamePath;
    const dotMinecraft = isCustomInstance ? import_path4.default.join(gameRoot, ".minecraft") : gameRoot;
    if (!import_fs6.default.existsSync(dotMinecraft)) import_fs6.default.mkdirSync(dotMinecraft, { recursive: true });
    const sensitiveCache = import_path4.default.join(dotMinecraft, ".fabric", "remappedJars");
    if (import_fs6.default.existsSync(sensitiveCache)) {
      console.log("Clearing remappedJars cache to force fresh map...");
      import_fs6.default.rmSync(sensitiveCache, { recursive: true, force: true });
    }
    const binDir = import_path4.default.join(dotMinecraft, "bin");
    const nativesDir = import_path4.default.join(binDir, "natives");
    const librariesDir = import_path4.default.join(gameRoot, "libraries");
    try {
      if (!options.username) throw new Error("Username required");
      this.sendProgress(event.sender, "Verificando Java...", 5);
      try {
        this.javaPath = options.javaPath || await this.javaManager.ensureJava(event.sender);
      } catch (e) {
        throw new Error("Falha ao configurar Java: " + e.message);
      }
      this.sendProgress(event.sender, "Verificando vers\xE3o...", 65);
      const manifestRes = await fetch(VERSION_MANIFEST_URL);
      const manifest = await manifestRes.json();
      const versionData = manifest.versions.find((v) => v.id === TARGET_VERSION_ID);
      if (!versionData) throw new Error(`Version ${TARGET_VERSION_ID} not found`);
      const versionDetailsRes = await fetch(versionData.url);
      const versionDetails = await versionDetailsRes.json();
      const clientUrl = versionDetails.downloads.client.url;
      const mcJarPath = await this.downloadFile(clientUrl, binDir, "minecraft.jar", event.sender);
      if (!isCustomInstance) {
        this.sendProgress(event.sender, "Baixando bibliotecas...", 70);
        let nativesClassifier = "natives-linux";
        if (process.platform === "win32") nativesClassifier = "natives-windows";
        else if (process.platform === "darwin") nativesClassifier = "natives-osx";
        for (const lib of versionDetails.libraries) {
          if (lib.downloads && lib.downloads.classifiers && lib.downloads.classifiers[nativesClassifier]) {
            const native = lib.downloads.classifiers[nativesClassifier];
            const tempNativePath = await this.downloadFile(native.url, import_path4.default.join(gameRoot, "temp_natives"), import_path4.default.basename(native.path), event.sender);
            if (validateZipFile(tempNativePath)) {
              const zip = new import_adm_zip3.default(tempNativePath);
              zip.extractAllTo(nativesDir, true);
            } else {
              console.warn(`[GameHandler] Skipping invalid native file: ${tempNativePath}`);
            }
          }
        }
        const openalPath = import_path4.default.join(nativesDir, process.platform === "win32" ? "OpenAL-amd64.dll" : "libopenal.so");
        if (!import_fs6.default.existsSync(openalPath)) {
          console.log("[GameHandler] OpenAL not found, downloading from Legacy Fabric...");
          this.sendProgress(event.sender, "Baixando OpenAL...", 72);
          let lwjglClassifier = "natives-linux";
          if (process.platform === "win32") lwjglClassifier = "natives-windows";
          else if (process.platform === "darwin") lwjglClassifier = "natives-osx";
          const lwjglNativeUrl = `https://repo.legacyfabric.net/repository/legacyfabric/org/lwjgl/lwjgl/lwjgl-platform/2.9.4+legacyfabric.9/lwjgl-platform-2.9.4+legacyfabric.9-${lwjglClassifier}.jar`;
          try {
            const tempLwjglPath = await this.downloadFile(lwjglNativeUrl, import_path4.default.join(gameRoot, "temp_natives"), `lwjgl-platform-${lwjglClassifier}.jar`, event.sender);
            if (validateZipFile(tempLwjglPath)) {
              const zip = new import_adm_zip3.default(tempLwjglPath);
              zip.extractAllTo(nativesDir, true);
              console.log("[GameHandler] OpenAL natives extracted successfully");
            }
          } catch (e) {
            console.warn("[GameHandler] Failed to download OpenAL natives:", e);
          }
        }
      }
      let classpath = [mcJarPath];
      let mainClass = "net.minecraft.client.Minecraft";
      let tweakClass = "";
      if (isCustomInstance) {
        const mmcPath = import_path4.default.join(instanceDir, "mmc-pack.json");
        if (import_fs6.default.existsSync(mmcPath)) {
          const mmcPack = JSON.parse(import_fs6.default.readFileSync(mmcPath, "utf-8"));
          const fabricComponent = mmcPack.components.find((c) => c.uid === "net.fabricmc.fabric-loader");
          if (fabricComponent) {
            this.sendProgress(event.sender, "Configurando Fabric/StationAPI...", 75);
            const fabricLibs = [
              // ASM (Required by Mixin)
              { name: "asm:9.7.1", group: "org.ow2.asm", artifact: "asm", version: "9.7.1" },
              { name: "asm-analysis:9.7.1", group: "org.ow2.asm", artifact: "asm-analysis", version: "9.7.1" },
              { name: "asm-commons:9.7.1", group: "org.ow2.asm", artifact: "asm-commons", version: "9.7.1" },
              { name: "asm-tree:9.7.1", group: "org.ow2.asm", artifact: "asm-tree", version: "9.7.1" },
              { name: "asm-util:9.7.1", group: "org.ow2.asm", artifact: "asm-util", version: "9.7.1" },
              // Mixin
              { name: "sponge-mixin:0.15.3+mixin.0.8.7", group: "net.fabricmc", artifact: "sponge-mixin", version: "0.15.3+mixin.0.8.7" },
              { name: "mixinextras-fabric:0.4.1", group: "io.github.llamalad7", artifact: "mixinextras-fabric", version: "0.4.1" },
              // Commons (Required by StationAPI/Fabric)
              { name: "commons-lang3:3.12.0", group: "org.apache.commons", artifact: "commons-lang3", version: "3.12.0" },
              { name: "commons-io:2.11.0", group: "commons-io", artifact: "commons-io", version: "2.11.0" },
              { name: "commons-codec:1.15", group: "commons-codec", artifact: "commons-codec", version: "1.15" },
              // LWJGL/JInput (Prism/Babric Specific Versions)
              { name: "jutils:1.0.0", group: "net.java.jutils", artifact: "jutils", version: "1.0.0" },
              { name: "jinput:2.0.5", group: "net.java.jinput", artifact: "jinput", version: "2.0.5" },
              { name: "lwjgl:2.9.4+legacyfabric.9", group: "org.lwjgl.lwjgl", artifact: "lwjgl", version: "2.9.4+legacyfabric.9" },
              { name: "lwjgl_util:2.9.4+legacyfabric.9", group: "org.lwjgl.lwjgl", artifact: "lwjgl_util", version: "2.9.4+legacyfabric.9" },
              // Logging (Prism uses these exact versions)
              { name: "log4j-api:2.16.0", group: "org.apache.logging.log4j", artifact: "log4j-api", version: "2.16.0" },
              { name: "log4j-core:2.16.0", group: "org.apache.logging.log4j", artifact: "log4j-core", version: "2.16.0" },
              { name: "log4j-slf4j18-impl:2.16.0", group: "org.apache.logging.log4j", artifact: "log4j-slf4j18-impl", version: "2.16.0" },
              { name: "terminalconsoleappender:1.2.0", group: "net.minecrell", artifact: "terminalconsoleappender", version: "1.2.0" },
              // SLF4J (Prism uses 1.8.0-beta4)
              { name: "slf4j-api:1.8.0-beta4", group: "org.slf4j", artifact: "slf4j-api", version: "1.8.0-beta4" },
              // Guava (Critical for modern Fabric/Mixin on older MC)
              { name: "guava:31.0.1-jre", group: "com.google.guava", artifact: "guava", version: "31.0.1-jre" },
              { name: "failureaccess:1.0.1", group: "com.google.guava", artifact: "failureaccess", version: "1.0.1" },
              // GSON (Required by Fabric)
              { name: "gson:2.8.9", group: "com.google.code.gson", artifact: "gson", version: "2.8.9" },
              // Babric Log4j Config (from Prism log)
              { name: "log4j-config:1.0.0", group: "babric", artifact: "log4j-config", version: "1.0.0" }
            ];
            const fabricBase = "https://maven.fabricmc.net/";
            const mavenCentral = "https://repo1.maven.org/maven2/";
            const legacyFabricRepo = "https://repo.legacyfabric.net/repository/legacyfabric/";
            const babricRepo = "https://maven.glass-launcher.net/babric/";
            console.log("[GameHandler] Using Maven-based library downloads");
            if (!import_fs6.default.existsSync(librariesDir)) {
              import_fs6.default.mkdirSync(librariesDir, { recursive: true });
            }
            for (const lib of fabricLibs) {
              const pathStr = `${lib.group.replace(/\./g, "/")}/${lib.artifact}/${lib.version}/${lib.artifact}-${lib.version}.jar`;
              const localPath2 = import_path4.default.join(librariesDir, `${lib.artifact}-${lib.version}.jar`);
              if (import_fs6.default.existsSync(localPath2)) {
                classpath.push(localPath2);
                continue;
              }
              let url = fabricBase + pathStr;
              const mavenCentralGroups = [
                "org.apache",
                "commons-io",
                "commons-codec",
                "net.java.jutils",
                "net.java.jinput",
                "org.ow2.asm",
                "com.google.guava",
                "com.google.code.gson",
                "org.slf4j",
                "io.github.llamalad7",
                "net.minecrell"
              ];
              const isMavenCentral = mavenCentralGroups.some((g) => lib.group.startsWith(g) || lib.group === g);
              if (isMavenCentral) {
                url = mavenCentral + pathStr;
              } else if (lib.group.startsWith("org.lwjgl")) {
                url = legacyFabricRepo + pathStr;
              } else if (lib.group === "babric") {
                url = babricRepo + pathStr;
              }
              const libPath = await this.downloadFile(url, librariesDir, `${lib.artifact}-${lib.version}.jar`, event.sender);
              classpath.push(libPath);
            }
            this.sendProgress(event.sender, "Baixando nativos...", 78);
            if (import_fs6.default.existsSync(nativesDir)) {
              console.log("[GameHandler] Clearing natives folder for fresh extraction...");
              import_fs6.default.rmSync(nativesDir, { recursive: true, force: true });
            }
            import_fs6.default.mkdirSync(nativesDir, { recursive: true });
            let classifier = "natives-linux";
            if (process.platform === "win32") classifier = "natives-windows";
            else if (process.platform === "darwin") classifier = "natives-osx";
            const nativesList = [
              { group: "org.lwjgl.lwjgl", artifact: "lwjgl-platform", version: "2.9.4+legacyfabric.9", classifier },
              { group: "net.java.jinput", artifact: "jinput-platform", version: "2.0.5", classifier }
            ];
            for (const native of nativesList) {
              const filename = `${native.artifact}-${native.version}-${native.classifier}.jar`;
              const pathStr = `${native.group.replace(/\./g, "/")}/${native.artifact}/${native.version}/${filename}`;
              const localPath2 = import_path4.default.join(librariesDir, filename);
              if (import_fs6.default.existsSync(localPath2)) {
                console.log(`[Cache] Found native library locally: ${filename}`);
                await safeExtractZipWithRetry(localPath2, nativesDir);
                continue;
              }
              let url = legacyFabricRepo + pathStr;
              if (native.group === "net.java.jinput") {
                url = mavenCentral + pathStr;
              }
              const tempPath = await this.downloadFile(url, import_path4.default.join(gameRoot, "temp_natives"), filename, event.sender);
              await safeExtractZipWithRetry(tempPath, nativesDir);
            }
            if (process.platform === "darwin") {
              try {
                const files = import_fs6.default.readdirSync(nativesDir);
                for (const file of files) {
                  if (file.endsWith(".jnilib")) {
                    const oldPath = import_path4.default.join(nativesDir, file);
                    const newPath = import_path4.default.join(nativesDir, file.replace(".jnilib", ".dylib"));
                    if (import_fs6.default.existsSync(oldPath)) {
                      console.log(`[GameHandler] Renaming ${file} to .dylib`);
                      try {
                        if (import_fs6.default.existsSync(newPath)) import_fs6.default.unlinkSync(newPath);
                        import_fs6.default.renameSync(oldPath, newPath);
                      } catch (renameErr) {
                        console.warn(`[GameHandler] Failed to rename ${file}:`, renameErr);
                      }
                    }
                  }
                }
              } catch (e) {
                console.warn("[GameHandler] Failed to process macOS natives:", e);
              }
            }
            if (process.platform === "win32") {
              try {
                const openal64Path = import_path4.default.join(nativesDir, "OpenAL64.dll");
                const openal32Path = import_path4.default.join(nativesDir, "OpenAL32.dll");
                console.log("[GameHandler] Downloading compatible OpenAL from Minecraft LWJGL 2.9.4...");
                this.sendProgress(event.sender, "Baixando OpenAL compat\xEDvel...", 79);
                const mcLwjgl2Url = "https://libraries.minecraft.net/org/lwjgl/lwjgl/lwjgl-platform/2.9.4-nightly-20150209/lwjgl-platform-2.9.4-nightly-20150209-natives-windows.jar";
                try {
                  const tempOpenALPath = import_path4.default.join(gameRoot, "temp_natives", "mc-lwjgl2-natives.jar");
                  const response = await fetch(mcLwjgl2Url, { signal: AbortSignal.timeout(3e4) });
                  if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    if (buffer.length >= 4 && buffer[0] === 80 && buffer[1] === 75) {
                      import_fs6.default.mkdirSync(import_path4.default.dirname(tempOpenALPath), { recursive: true });
                      import_fs6.default.writeFileSync(tempOpenALPath, buffer);
                      const zip = new import_adm_zip3.default(tempOpenALPath);
                      const entries = zip.getEntries();
                      for (const entry of entries) {
                        if (entry.entryName === "OpenAL64.dll" && !entry.isDirectory) {
                          import_fs6.default.writeFileSync(openal64Path, entry.getData());
                          console.log("[GameHandler] Installed OpenAL64.dll from Minecraft LWJGL 2.9.4");
                        }
                        if (entry.entryName === "OpenAL32.dll" && !entry.isDirectory) {
                          import_fs6.default.writeFileSync(openal32Path, entry.getData());
                          console.log("[GameHandler] Installed OpenAL32.dll from Minecraft LWJGL 2.9.4");
                        }
                      }
                      if (import_fs6.default.existsSync(openal64Path)) {
                        import_fs6.default.copyFileSync(openal64Path, import_path4.default.join(nativesDir, "OpenAL.dll"));
                      }
                    } else {
                      console.warn("[GameHandler] Downloaded natives is not a valid ZIP");
                    }
                  } else {
                    console.warn("[GameHandler] Failed to download MC LWJGL 2 natives:", response.statusText);
                  }
                } catch (downloadErr) {
                  console.warn("[GameHandler] Failed to download Minecraft OpenAL:", downloadErr);
                  const files = import_fs6.default.readdirSync(nativesDir);
                  const renameMap = {
                    "OpenAL-amd64.dll": "OpenAL64.dll",
                    "OpenAL-i386.dll": "OpenAL32.dll",
                    "OpenAL-aarch64.dll": "OpenAL64.dll"
                  };
                  for (const [oldName, newName] of Object.entries(renameMap)) {
                    if (files.includes(oldName)) {
                      const oldPath = import_path4.default.join(nativesDir, oldName);
                      const newPath = import_path4.default.join(nativesDir, newName);
                      if (import_fs6.default.existsSync(newPath)) import_fs6.default.unlinkSync(newPath);
                      import_fs6.default.copyFileSync(oldPath, newPath);
                      console.log(`[GameHandler] Fallback: Copied ${oldName} to ${newName}`);
                    }
                  }
                }
              } catch (e) {
                console.warn("[GameHandler] Failed to process Windows OpenAL natives:", e);
              }
            }
            try {
              const nativesContents = import_fs6.default.readdirSync(nativesDir);
              console.log(`[GameHandler] Natives folder contents (${nativesDir}):`, nativesContents);
            } catch (e) {
              console.error("[GameHandler] Failed to read natives folder:", e);
            }
            const loaderUrl = "https://maven.fabricmc.net/net/fabricmc/fabric-loader/0.16.7/fabric-loader-0.16.7.jar";
            const loaderPath = await this.downloadFile(loaderUrl, librariesDir, "fabric-loader-0.16.7.jar", event.sender);
            const intermediaryUrl = "https://maven.glass-launcher.net/babric/babric/intermediary-upstream/b1.7.3/intermediary-upstream-b1.7.3.jar";
            const intermediaryPath = await this.downloadFile(intermediaryUrl, librariesDir, "intermediary-upstream-b1.7.3.jar", event.sender);
            classpath.push(loaderPath);
            classpath.push(intermediaryPath);
            mainClass = "net.fabricmc.loader.impl.launch.knot.KnotClient";
            const newClasspath = [];
            for (const p of classpath) {
              if (p !== mcJarPath) newClasspath.push(p);
            }
            newClasspath.push(mcJarPath);
            classpath = newClasspath;
          }
        }
      }
      if (!isCustomInstance) {
        for (const lib of versionDetails.libraries) {
          if (lib.downloads && lib.downloads.artifact) {
            const art = lib.downloads.artifact;
            if (art.path.includes("lwjgl") || art.path.includes("jinput")) {
              const libPath = await this.downloadFile(art.url, binDir, import_path4.default.basename(art.path), event.sender);
              classpath.push(libPath);
            }
          }
        }
      }
      this.sendProgress(event.sender, "Iniciando Jogo...", 95);
      const minMem = options.settings?.minMemory || "512";
      const maxMem = options.settings?.maxMemory || "2048";
      const customArgs = options.settings?.javaArgs || "";
      let openalLibPath = "";
      try {
        if (import_fs6.default.existsSync(nativesDir)) {
          const nativesFiles = import_fs6.default.readdirSync(nativesDir);
          const priorities = [
            "OpenAL64.dll",
            "OpenAL32.dll",
            "OpenAL-amd64.dll",
            "OpenAL-i386.dll",
            // Windows
            "libopenal.so",
            // Linux
            "libopenal.dylib",
            "openal.dylib"
            // macOS
          ];
          for (const p of priorities) {
            if (nativesFiles.includes(p)) {
              openalLibPath = import_path4.default.join(nativesDir, p).replace(/\\/g, "/");
              console.log(`[GameHandler] Found OpenAL library: ${openalLibPath}`);
              break;
            }
          }
          if (!openalLibPath) {
            const found = nativesFiles.find((f) => f.toLowerCase().includes("openal") && (f.endsWith(".dll") || f.endsWith(".so") || f.endsWith(".dylib")));
            if (found) {
              openalLibPath = import_path4.default.join(nativesDir, found).replace(/\\/g, "/");
              console.log(`[GameHandler] Found OpenAL library (fallback): ${openalLibPath}`);
            }
          }
        }
      } catch (e) {
        console.warn("[GameHandler] Failed to scan for OpenAL lib:", e);
      }
      const launchArgs = [
        `-Xms${minMem}M`,
        `-Xmx${maxMem}M`,
        "-Djava.library.path=" + nativesDir,
        "-Dorg.lwjgl.librarypath=" + nativesDir,
        // Fix for some lwjgl versions
        "-Dfabric.gameJarPath=" + mcJarPath,
        "-Dfabric.gameVersion=b1.7.3",
        "-Dfabric.envType=client",
        // Suppress SLF4J "no providers" warning
        "-Dslf4j.internal.verbosity=ERROR",
        // Disable legacy resource downloads from defunct S3 bucket
        "-Dminecraft.resources.index=" + import_path4.default.join(dotMinecraft, "resources"),
        "-Dminecraft.applet.TargetDirectory=" + dotMinecraft,
        "-Dminecraft.applet.BaseURL=file:///"
      ];
      if (customArgs.trim()) {
        const customArgsArray = customArgs.trim().split(/\s+/).filter((arg) => arg.length > 0);
        launchArgs.push(...customArgsArray);
      }
      launchArgs.push("-cp", classpath.join(import_path4.default.delimiter));
      launchArgs.push(mainClass);
      launchArgs.push("--username", options.username);
      launchArgs.push("--gameDir", dotMinecraft);
      launchArgs.push("--assetsDir", import_path4.default.join(dotMinecraft, "resources"));
      if (isCustomInstance && mainClass.includes("KnotClient")) {
        launchArgs.push("--assetIndex", "truly_legacy");
      }
      launchArgs.push("--server", "185.100.215.195");
      launchArgs.push("--port", "25565");
      console.log("Spawning java:", this.javaPath);
      console.log("Args:", launchArgs);
      const gameEnv = {
        ...process.env,
        // Increase OpenAL buffer size to prevent timing warnings
        ALSOFT_CONF: "period_size=2048",
        // Prefer PulseAudio/PipeWire backend
        ALSOFT_DRIVERS: "pulse,alsa,oss"
      };
      this.gameProcess = (0, import_child_process2.spawn)(this.javaPath, launchArgs, {
        cwd: dotMinecraft,
        env: gameEnv
      });
      const suppressedPatterns = [
        "s3.amazonaws.com/MinecraftResources",
        "Failed to add pack.mcmeta",
        "Failed to add READ_ME_I_AM_VERY_IMPORTANT"
      ];
      this.gameProcess.stdout.on("data", (data) => {
        const log = data.toString().trim();
        if (!log) return;
        Logger.game("stdout", log);
        if (suppressedPatterns.some((pattern) => log.includes(pattern))) {
          return;
        }
        console.log(`[MC]: ${log}`);
        if (log.includes("Connecting to")) {
          event.sender.send("game-connected");
        }
      });
      this.gameProcess.stderr.on("data", (data) => {
        const log = data.toString().trim();
        if (!log) return;
        Logger.game("stderr", log);
        if (suppressedPatterns.some((pattern) => log.includes(pattern))) {
          return;
        }
        console.error(`[MC-Err]: ${log}`);
      });
      this.gameProcess.on("close", (code) => {
        Logger.info("GameHandler", `Minecraft exited with code ${code}`);
        console.log(`Minecraft exited with code ${code}`);
        this.sendProgress(event.sender, "Jogo fechado", 100);
        this.gameProcess = null;
        event.sender.send("game-closed", code);
      });
      return { success: true };
    } catch (e) {
      console.error("Launch failed:", e);
      this.sendProgress(event.sender, `Erro: ${e.message}`, 0);
      return { success: false, error: e.message, stack: e.stack };
    }
  }
  // End of class (Removed unused methods: getVersionDetails, downloadLibraries, spawnGameProcess, old downloadFile)
  async handleUpdateCheck() {
    try {
      const updateCheck = await this.updateManager.checkForUpdates();
      if (!updateCheck.remoteVersions) {
        return { available: false, error: "Failed to fetch version info" };
      }
      const hasUpdates = updateCheck.instanceUpdate || updateCheck.librariesUpdate || updateCheck.modsUpdate;
      if (hasUpdates) {
        return {
          available: true,
          instanceUpdate: updateCheck.instanceUpdate,
          librariesUpdate: updateCheck.librariesUpdate,
          modsUpdate: updateCheck.modsUpdate,
          notes: updateCheck.remoteVersions.mods?.notes || "Atualiza\xE7\xF5es dispon\xEDveis"
        };
      }
      return { available: false };
    } catch (e) {
      console.error("Update check failed:", e);
      return { available: false, error: String(e) };
    }
  }
  async handlePerformUpdate(event) {
    try {
      const result = await this.updateManager.performAllUpdates((status, percent) => {
        this.sendProgress(event.sender, status, percent);
      });
      return result;
    } catch (e) {
      console.error("Update failed:", e);
      this.sendProgress(event.sender, `Erro na atualiza\xE7\xE3o: ${e}`, 0);
      return { success: false, error: String(e) };
    }
  }
};

// electron/main.ts
import_electron5.app.commandLine.appendSwitch("no-sandbox");
import_electron5.app.commandLine.appendSwitch("ozone-platform-hint", "auto");
var gameHandler = new GameHandler();
gameHandler.init();
console.log("=== BlockyCRAFT Launcher Starting ===");
console.log("Electron version:", process.versions.electron);
var mainWindow = null;
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  console.log("Creating main window...");
  mainWindow = new import_electron5.BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    frame: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: import_node_path.default.join(__dirname, "preload.cjs"),
      sandbox: false
    },
    backgroundColor: "#0f0f0f",
    show: true,
    autoHideMenuBar: true
    // Hide menu bar
  });
  mainWindow.setMenu(null);
  import_electron5.ipcMain.handle("open-external", async (event, url) => {
    console.log("Opening external URL:", url);
    const openInInternalWindow = () => {
      const { nativeTheme } = require("electron");
      nativeTheme.themeSource = "dark";
      const win = new import_electron5.BrowserWindow({
        width: 1024,
        height: 800,
        title: "BlockyCRAFT",
        autoHideMenuBar: true,
        backgroundColor: "#1a1a1a",
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });
      win.setMenu(null);
      win.loadURL(url);
    };
    if (process.platform === "linux") {
      openInInternalWindow();
    } else {
      const { shell } = await import("electron");
      shell.openExternal(url);
    }
  });
  console.log("Window created, loading content...");
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    const filePath = import_node_path.default.join(__dirname, "../dist/index.html");
    mainWindow.loadFile(filePath);
  }
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Create Window: did-finish-load");
  });
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.error("Create Window: did-fail-load", errorCode, errorDescription, validatedURL);
  });
  mainWindow.webContents.on("render-process-gone", (event, details) => {
    console.error("Create Window: render-process-gone", details);
  });
  mainWindow.webContents.on("unresponsive", () => {
    console.error("Create Window: unresponsive");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
import_electron5.app.whenReady().then(() => {
  Logger.init();
  Logger.info("Main", `Electron version: ${process.versions.electron}`);
  Logger.info("Main", `Node version: ${process.versions.node}`);
  Logger.info("Main", `Platform: ${process.platform} ${process.arch}`);
  createWindow();
});
import_electron5.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron5.app.quit();
  }
});
import_electron5.app.on("activate", () => {
  if (import_electron5.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//# sourceMappingURL=main.cjs.map
