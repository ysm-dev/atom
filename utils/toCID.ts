import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'

export const toCID = async (txt: string) =>
  CID.createV1(
    raw.code,
    await sha256.digest(raw.encode(new TextEncoder().encode(txt))),
  )
    .toV1()
    .toString()
