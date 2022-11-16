const tsTakenMs = (startMs) => {
  return Date.now() - startMs;
};

const getCurrentEpoch = () => Math.round(Date.now() / 1000);

/**
 * https://en.wikipedia.org/wiki/ISO_8601
 *
 * @return {string} e.g. '2020-07-29 03:12:27.701'
 */
const isoDateTimeString = () => new Date().toISOString().replace(/T/, ' ').replace(/Z/g, '');
const getExpirationTs = ttlSeconds => {
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  return secondsSinceEpoch + ttlSeconds;
};

module.exports = {
  tsTakenMs,
  getCurrentEpoch,
  isoDateTimeString,
  getExpirationTs
};
