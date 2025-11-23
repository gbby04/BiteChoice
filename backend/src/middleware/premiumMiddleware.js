const premiumMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // TODO: Query DB for subscription
    const isPremium = true; // placeholder

    if (!isPremium) {
      return res.status(403).json({
        error: "This feature requires a premium subscription",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Premium check failed" });
  }
};

module.exports = premiumMiddleware;
