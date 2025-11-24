import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': 'Kullanıcı adı metin olmalıdır',
    'string.alphanum': 'Kullanıcı adı sadece harf ve rakam içerebilir',
    'string.min': 'Kullanıcı adı en az 3 karakter olmalıdır',
    'string.max': 'Kullanıcı adı en fazla 30 karakter olmalıdır',
    'any.required': 'Kullanıcı adı gereklidir'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'E-posta metin olmalıdır',
    'string.email': 'Geçerli bir e-posta adresi giriniz',
    'any.required': 'E-posta gereklidir'
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Şifre metin olmalıdır',
    'string.min': 'Şifre en az 6 karakter olmalıdır',
    'any.required': 'Şifre gereklidir'
  })
});

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'Kullanıcı adı metin olmalıdır',
    'any.required': 'Kullanıcı adı gereklidir'
  }),
  password: Joi.string().required().messages({
    'string.base': 'Şifre metin olmalıdır',
    'any.required': 'Şifre gereklidir'
  })
});

export const changePasswordSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': 'Kullanıcı ID bir sayı olmalıdır',
    'number.integer': 'Kullanıcı ID tam sayı olmalıdır',
    'number.positive': 'Kullanıcı ID pozitif olmalıdır',
    'any.required': 'Kullanıcı ID gereklidir'
  }),
  oldPassword: Joi.string().required().messages({
    'string.base': 'Eski şifre metin olmalıdır',
    'any.required': 'Eski şifre gereklidir'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.base': 'Yeni şifre metin olmalıdır',
    'string.min': 'Yeni şifre en az 6 karakter olmalıdır',
    'any.required': 'Yeni şifre gereklidir'
  })
});

export const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  req.validatedData = value;
  next();
};

export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  req.validatedData = value;
  next();
};

export const validateChangePassword = (req, res, next) => {
  const { error, value } = changePasswordSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  req.validatedData = value;
  next();
};
