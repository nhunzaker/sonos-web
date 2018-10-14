const refresh = require("passport-oauth2-refresh");

const LOGIN_PATH = "/login";

function authenticated(req, res, next) {
  // Avoid redirect loops trying to authenticate...
  if (req.path === LOGIN_PATH) {
    return next();
  }

  const user = req.user || {};
  const refreshToken = user.refresh;
  const expired = userExpired(req.user);

  if (req.isAuthenticated() && !expired) {
    return next();
  } else if (expired && refreshToken) {
    refresh.requestNewAccessToken(
      "oauth2",
      refreshToken,
      null,
      (_, token, refreshToken, results) => {
        const session = req.session;
        if (session) {
          const user =
            (session && session.passport && session.passport.user) || {};
          updateUser(user, token, refreshToken);
          session.save(err => console.error(err));
        }
        return next();
      }
    );
  } else {
    switch (req.headers["content-type"]) {
      case "text/html":
        return res.redirect(LOGIN_PATH);
      default:
        res.status(401).send("You must be logged in");
    }
  }
}

function updateUser(user, token, refreshToken) {
  user.token = token;
  user.refresh = refreshToken;
  user.expire = new Date();
  user.expire.setTime(user.expire.getTime() + 55 * 60 * 1000);

  return user;
}

function userExpired(user) {
  if (!(user && user.expire)) {
    return true;
  }

  const expire =
    typeof user.expire === "string"
      ? new Date(Date.parse(user.expire))
      : user.expire;

  const now = new Date();

  return expire < now;
}

module.exports = { authenticated, updateUser };
