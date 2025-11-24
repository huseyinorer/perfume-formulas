import Joi from 'joi';

export const formulaSchema = Joi.object({
  perfume_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Parfüm ID bir sayı olmalıdır',
    'number.integer': 'Parfüm ID tam sayı olmalıdır',
    'number.positive': 'Parfüm ID pozitif olmalıdır',
    'any.required': 'Parfüm seçilmedi'
  }),
  fragrancePercentage: Joi.number().min(0).max(100).required().messages({
    'number.base': 'Esans yüzdesi bir sayı olmalıdır',
    'number.min': 'Esans yüzdesi 0\'dan küçük olamaz',
    'number.max': 'Esans yüzdesi 100\'den büyük olamaz',
    'any.required': 'Esans yüzdesi gereklidir'
  }),
  alcoholPercentage: Joi.number().min(0).max(100).required().messages({
    'number.base': 'Alkol yüzdesi bir sayı olmalıdır',
    'number.min': 'Alkol yüzdesi 0\'dan küçük olamaz',
    'number.max': 'Alkol yüzdesi 100\'den büyük olamaz',
    'any.required': 'Alkol yüzdesi gereklidir'
  }),
  waterPercentage: Joi.number().min(0).max(100).required().messages({
    'number.base': 'Su yüzdesi bir sayı olmalıdır',
    'number.min': 'Su yüzdesi 0\'dan küçük olamaz',
    'number.max': 'Su yüzdesi 100\'den büyük olamaz',
    'any.required': 'Su yüzdesi gereklidir'
  }),
  restDay: Joi.number().integer().min(0).required().messages({
    'number.base': 'Dinlenme günü bir sayı olmalıdır',
    'number.integer': 'Dinlenme günü tam sayı olmalıdır',
    'number.min': 'Dinlenme günü 0\'dan küçük olamaz',
    'any.required': 'Dinlenme günü gereklidir'
  }),
  userId: Joi.number().integer().positive().optional().allow(null)
}).custom((value, helpers) => {
  const sum = value.fragrancePercentage + value.alcoholPercentage + value.waterPercentage;
  if (Math.abs(sum - 100) > 0.01) { // Float comparison tolerance
    return helpers.error('percentages.sum', { sum });
  }
  return value;
}, 'Percentage sum validation').messages({
  'percentages.sum': 'Yüzdeler toplamı 100 olmalıdır (Şu an: {{#sum}})'
});

export const validateFormula = (req, res, next) => {
  const { error, value } = formulaSchema.validate(req.body, { abortEarly: false });

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
