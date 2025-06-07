const refreshToken = new Set();

exports.addToken = async (token) => await refreshToken.add(token);
exports.hasToken = async (token) => {
  return await refreshToken.has(token);
};
exports.removeToken = (token) => refreshToken.delete(token);
exports.clearAll = () => refreshToken.clear();
exports.getToken = (token) => refreshToken.values();
