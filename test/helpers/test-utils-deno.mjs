import { crypto } from 'jsr:@std/crypto/crypto'
import { encodeHex } from 'jsr:@std/encoding'
import { Buffer } from 'node:buffer'

export function stream2cb (stream, cb) {
  const chunks = []
  let complete
  stream.on('data', function (d) {
    chunks.push(d)
  })
  stream.on('end', function () {
    if (!complete) {
      complete = true
      cb(null, Buffer.concat(chunks))
    }
  })
  stream.on('error', function (e) {
    if (!complete) {
      complete = true
      cb(e)
    }
  })
}

export function stream2promise (stream) {
  const chunks = []
  let complete

  return new Promise((resolve, reject) => {
    stream.on('data', function (d) {
      chunks.push(d)
    })
    stream.on('end', function () {
      if (!complete) {
        complete = true
        resolve(Buffer.concat(chunks))
      }
    })
    stream.on('error', function (e) {
      if (!complete) {
        complete = true
        reject(e)
      }
    })
  })
}

// Generate buffer with specific size.
export function testBuffer (size, start = 0, step = 1) {
  const buffer = Buffer.alloc(size)
  for (let i = 0; i < size; i++) {
    buffer[i] = (start + i * step) % 255
  }
  return buffer
}

// Helper for getting hex-sha1 for a buffer.
export function sha1 (buf) {
  return encodeHex(new Uint8Array(crypto.subtle.digestSync('SHA-1', buf)))
}
