"use strict";

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