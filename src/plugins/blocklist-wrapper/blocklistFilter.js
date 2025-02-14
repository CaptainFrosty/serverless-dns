/*
 * Copyright (c) 2021 RethinkDNS and its authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { customTagToFlag as _customTagToFlag } from "./radixTrie.js";
import * as dnsutil from "../../commons/dnsutil.js";
import * as dnsBlockUtil from "../dnsblockutil.js";

export class BlocklistFilter {
  constructor() {
    // see: src/helpers/node/blocklists.js:hasBlocklistFiles
    this.t = null;
    this.ft = null;
    this.blocklistBasicConfig = null;
    this.blocklistFileTag = null;
    this.enc = new TextEncoder();
  }

  loadFilter(t, ft, blocklistBasicConfig, blocklistFileTag) {
    this.t = t;
    this.ft = ft;
    this.blocklistBasicConfig = blocklistBasicConfig;
    this.blocklistFileTag = blocklistFileTag;
  }

  getDomainInfo(domainName) {
    const n = dnsutil.normalizeName(domainName);

    return {
      searchResult: this.hadDomainName(n),
    };
  }

  hadDomainName(n) {
    return this.ft.lookup(this.reverseUtf8(n));
  }

  reverseUtf8(s) {
    return this.enc.encode(s).reverse();
  }

  getTag(uintFlag) {
    return this.t.flagsToTag(uintFlag);
  }

  customTagToFlag(tagList) {
    return _customTagToFlag(tagList, this.blocklistFileTag);
  }

  getB64FlagFromTag(tagList, flagVersion) {
    const uintFlag = this.customTagToFlag(tagList);
    return dnsBlockUtil.getB64Flag(uintFlag, flagVersion);
  }
}
