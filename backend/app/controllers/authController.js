const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { secret } = require('../config/auth');
const { User } = require('../models');

const { StatusCodes } = require('http-status-codes');
const { FORBIDDEN, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

exports.register = async (req, res) => {
  const { 
    username, 
    password, 
    email 
  } = req.body;

  const biometricSecret = `${secret}.${username}.${Date.now()}`;
  const biometricToken = bcrypt.hashSync(biometricSecret);

  try {
    const user = await User.create({
      username: username,
      password: bcrypt.hashSync(password),
      biometric: bcrypt.hashSync(biometricToken),
      email: email
    });

    if (user) {
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        biometricToken: biometricToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Create user failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { 
    username, 
    password, 
    biometric 
  } = req.body;

  const hasPassword = password;
  const hasBiometric = biometric;
  const hasCredentials = hasPassword || hasBiometric;
  const message = 'Invalid credentials';

  if (!username || !hasCredentials) {
    return res.status(BAD_REQUEST).json({
      message: message
    });
  }

  try {
    const user = await User.findOne({
      where: { username: username }
    });

    if (!user) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: message
      });
    }

    // check validity of password if login with password
    if (hasPassword) {
      const isPasswordValid = bcrypt.compareSync(
        password, 
        user.password
      );

      if (!isPasswordValid) {
        return res.status(BAD_REQUEST).json({
          message: message
        });
      }
    }

    // check validity of biometric if login with biometric
    if (hasBiometric) {
      const isBiometricValid = bcrypt.compareSync(
        biometric, 
        user.biometric
      );

      if (!isBiometricValid) {
        return res.status(BAD_REQUEST).json({
          message: message
        });
      }
    }

    const refreshTokenPlain = `refreshToken-${secret}.${username}.${Date.now()}`;
    const refreshToken = bcrypt.hashSync(refreshTokenPlain);

    const data = await User.update({
      refreshToken: bcrypt.hashSync(refreshToken),
      refreshTokenCreatedAt: new Date()
    }, {
      where: { username },
    });

    console.log(data);

    // data[0] contains affected rows
    const updated = data[0] > 0;

    if (!updated) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Failed at updating refreshToken'
      });
    }

    const payload = { 
      id: user.id, 
      username: user.username 
    };

    // jwt token will be expired after 24 hours
    // feel free to change it according to your app requirements
    const token = jwt.sign(payload, secret, { 
      expiresIn: 86400 
    });

    return res.json({
      id: user.id,
      username: user.username,
      refreshToken: refreshToken,
      token: token
    });
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: message
    });
  }
};

exports.refreshBiometric = async (req, res) => {
  const { userId, username } = req;

  const biometricSecret = `${secret}.${username}.${Date.now()}`;
  const biometricToken = bcrypt.hashSync(biometricSecret);
  const biometric = bcrypt.hashSync(biometricToken);
  
  try {
    const data = await User.update({ biometric }, { 
      where: { username },
    });
    
    // data[0] contains affected rows
    const updated = data[0] > 0;

    if (updated) {
      return res.json({
        id: userId,
        username: username,
        biometricToken: biometricToken
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Refresh biometric failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

exports.refreshToken = async (req, res) => {
  const {
    username,
    refreshToken
  } = req.body;

  const message = 'Invalid credentials';

  if (!username || !refreshToken) {
    return res.status(BAD_REQUEST).json({
      message: message
    });
  }

  try {
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: message
      });
    }

    const isRefreshTokenValid = bcrypt.compareSync(
      refreshToken,
      user.refreshToken
    );

    if (!isRefreshTokenValid) {
      return res.status(BAD_REQUEST).json({
        message: message
      });
    }

    // check refreshToken expiration time
    const refreshTokenCreatedAt = user.refreshTokenCreatedAt;
    // diff value in seconds
    const diff = Math.round((Date.now() - refreshTokenCreatedAt.getTime()) / 1000);

    // refreshToken will be expired after 3 days
    // feel free to change it according to your app requirements
    const isExpired = diff > (3 * 86400);

    if (isExpired) {
      return res.status(FORBIDDEN).json({
        message: 'Refresh token was expired. Please make a new login request'
      });
    }

    const payload = { 
      id: user.id, 
      username: user.username 
    };

    // jwt token will be expired after 24 hours
    // feel free to change it according to your app requirements
    const token = jwt.sign(payload, secret, { 
      expiresIn: 86400 
    });

    return res.json({
      id: user.id,
      username: user.username,
      refreshToken: refreshToken,
      token: token
    });
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: message
    });
  }
};