"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const repo = module.exports;

repo.measure = function (start, end, ctx) {
  const status = ctx.status || 404;
  let delta = end - start;
  delta = delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's';
  return {
    status,
    delta
  };
};