import Joi from 'joi';

export const perfumeSchema = Joi.object({
  brand_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Marka ID bir sayı olmalıdır',
    'number.integer': 'Marka ID tam sayı olmalıdır',
    'number.positive': 'Marka ID pozitif olmalıdır',
    'any.required': 'Marka seçilmedi'
  }),
  perfume_name: Joi.string().min(1).max(200).required().messages({
    'string.base': 'Parfüm adı metin olmalıdır',
    'string.min': 'Parfüm adı en az 1 karakter olmalıdır',
    'string.max': 'Parfüm adı en fazla 200 karakter olmalıdır',
    'any.required': 'Parfüm adı gereklidir'
  }),
  olfactive_family: Joi.string().max(100).optional().allow('', null),
  type: Joi.string().max(50).optional().allow('', null),
  pyramid_note: Joi.string().max(500).optional().allow('', null),
  top_notes: Joi.string().max(500).optional().allow('', null),
  middle_notes: Joi.string().max(500).optional().allow('', null),
  base_notes: Joi.string().max(500).optional().allow('', null),
  recommended_usage: Joi.string().max(200).optional().allow('', null)
});

export const validatePerfume = (req, res, next) => {
  const { error, value } = perfumeSchema.validate(req.body, { abortEarly: false });

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
