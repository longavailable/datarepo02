// http://yc.wswj.net/ahsxx/lol/script/watersecurity.js
var WaterSecurity = function () {
  this.init();
};
WaterSecurity.prototype = {
  version: "2.1",
  init: function () {
    String.prototype.gblen = function () {
      for (var len = 0, i = 0; i < this.length; i++)
        this.charCodeAt(i) > 127 || 94 == this.charCodeAt(i)
          ? (len += 2)
          : len++;
      return len;
    };
  },
  encode: function (data) {
    if ((this.print(data), "" == (data += ""))) return "";
    var length;
    (data = encodeURI(data).replace(/\+/g, "%2B")).gblen() % 2 != 0 &&
      (data += "*"),
      this.print(data),
      (data = this.parityTransposition(data)),
      this.print(data);
    var result = this.version + this.utf16to8(this.base64encode(data));
    return this.print(result), result;
  },
  print: function (data) {},
  parityTransposition: function (data) {
    for (var newData = [], i = 0; i < data.length; i += 2)
      newData.push(data[i + 1]), newData.push(data[i]);
    return (newData = newData.join(""));
  },
  decode: function (data) {
    if (
      ("string" != typeof data && (data += ""),
      this.print(data),
      data.length < 5 && ("" == data || "null" == data))
    )
      return "[]";
    if (this.version) {
      var versionS;
      if (data.substring(0, 3) !== this.version) return data;
      data = data.substring(3, data.length);
    }
    let endTag,
      tagsStr,
      tags,
      content = {};
    (endTag = data.substring(data.length - 4)),
      (tagsStr = data.substring(data.indexOf(endTag))),
      (tags = new Array()),
      (tagsStr = tagsStr.substring(4, tagsStr.length - 4));
    for (let i = 0; 4 * i < tagsStr.length; i++) {
      let tag = tagsStr.substr(4 * i, 4);
      (tags[i] = tag), (content[tag] = null);
    }
    const positions = this.getTagsPosition(data, tags);
    let index = 0;
    for (var i = 0; i < positions.length; i++) {
      var msg = data.substring(index, positions[i]),
        tag;
      (content[data.substr(positions[i], 4)] = msg), (index = positions[i] + 4);
    }
    data = null;
    for (var result = [], i = 0; i < tags.length; i++)
      result.push(content[tags[i]]);
    return (
      (result = result.join("")),
      (result = this.utf8to16(this.base64decode(result)))
    );
  },
  getTagsPosition: function (data, tags) {
    var positions = new Array();
    for (i = 0; i < tags.length; i++) positions[i] = data.indexOf(tags[i]);
    return positions.sort(function (a, b) {
      return a > b ? 1 : -1;
    });
  },
  base64EncodeChars:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  base64DecodeChars: new Array( -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
    63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    50, 51, -1, -1, -1, -1, -1  ),
  base64encode: function (str) {
    var out, i, len, c1, c2, c3;
    for (len = str.length, i = 0, out = []; i < len; ) {
      if (((c1 = 255 & str.charCodeAt(i++)), i == len)) {
        out.push(this.base64EncodeChars.charAt(c1 >> 2)),
          out.push(this.base64EncodeChars.charAt((3 & c1) << 4)),
          out.push("==");
        break;
      }
      if (((c2 = str.charCodeAt(i++)), i == len)) {
        out.push(this.base64EncodeChars.charAt(c1 >> 2)),
          out.push(
            this.base64EncodeChars.charAt(((3 & c1) << 4) | ((240 & c2) >> 4))
          ),
          out.push(this.base64EncodeChars.charAt((15 & c2) << 2)),
          out.push("=");
        break;
      }
      (c3 = str.charCodeAt(i++)),
        out.push(this.base64EncodeChars.charAt(c1 >> 2)),
        out.push(
          this.base64EncodeChars.charAt(((3 & c1) << 4) | ((240 & c2) >> 4))
        ),
        out.push(
          this.base64EncodeChars.charAt(((15 & c2) << 2) | ((192 & c3) >> 6))
        ),
        out.push(this.base64EncodeChars.charAt(63 & c3));
    }
    return out.join("");
  },
  base64decode: function (str) {
    var c1, c2, c3, c4, i, len, out;
    for (len = str.length, i = 0, out = []; i < len; ) {
      do {
        c1 = this.base64DecodeChars[255 & str.charCodeAt(i++)];
      } while (i < len && -1 == c1);
      if (-1 == c1) break;
      do {
        c2 = this.base64DecodeChars[255 & str.charCodeAt(i++)];
      } while (i < len && -1 == c2);
      if (-1 == c2) break;
      out.push(String.fromCharCode((c1 << 2) | ((48 & c2) >> 4)));
      do {
        if (61 == (c3 = 255 & str.charCodeAt(i++))) return out.join("");
        c3 = this.base64DecodeChars[c3];
      } while (i < len && -1 == c3);
      if (-1 == c3) break;
      out.push(String.fromCharCode(((15 & c2) << 4) | ((60 & c3) >> 2)));
      do {
        if (61 == (c4 = 255 & str.charCodeAt(i++))) return out.join("");
        c4 = this.base64DecodeChars[c4];
      } while (i < len && -1 == c4);
      if (-1 == c4) break;
      out.push(String.fromCharCode(((3 & c3) << 6) | c4));
    }
    return out.join("");
  },
  utf16to8: function (str) {
    var out, i, len, c;
    for (out = [], len = str.length, i = 0; i < len; i++)
      (c = str.charCodeAt(i)) >= 1 && c <= 127
        ? out.push(str.charAt(i))
        : c > 2047
        ? (out.push(String.fromCharCode(224 | ((c >> 12) & 15))),
          out.push(String.fromCharCode(128 | ((c >> 6) & 63))),
          out.push(String.fromCharCode(128 | ((c >> 0) & 63))))
        : (out.push(String.fromCharCode(192 | ((c >> 6) & 31))),
          out.push(String.fromCharCode(128 | ((c >> 0) & 63))));
    return out.join("");
  },
  utf8to16: function (str) {
    var out, i, len, c, char2, char3;
    for (out = [], len = str.length, i = 0; i < len; )
      switch ((c = str.charCodeAt(i++)) >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          out.push(str.charAt(i - 1));
          break;
        case 12:
        case 13:
          (char2 = str.charCodeAt(i++)),
            out.push(String.fromCharCode(((31 & c) << 6) | (63 & char2)));
          break;
        case 14:
          (char2 = str.charCodeAt(i++)),
            (char3 = str.charCodeAt(i++)),
            out.push(
              String.fromCharCode(
                ((15 & c) << 12) | ((63 & char2) << 6) | ((63 & char3) << 0)
              )
            );
      }
    return out.join("");
  },
};
var waterSecurity = new WaterSecurity();
