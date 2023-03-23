const axios = require('axios');

module.exports = async (req, res, next) => {
  const userToken = req.headers['authorization'];

  if (!userToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const response = await axios.get('https://gitlab.com/api/v4/user', {
      headers: { 'Authorization': `${userToken}` },
    });

    const user = response.data;

    // Check if the user has the required authorization
    // You can customize this logic based on your requirements
    if (userHasRequiredAuthorization(user)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

function userHasRequiredAuthorization(user) {
  // Implement your logic here to check if the user has the required authorization
  // For example, you can check if the user is part of a specific group in GitLab
  return true;
}
