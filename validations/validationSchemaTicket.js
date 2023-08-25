import Joi from 'joi';

export const ticketValidation = Joi.object({
  need: Joi.string()
    .required()
    .messages({
      'any.required': 'Este campo es requerido.'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Debe ser un correo electrónico válido.',
      'any.required': 'Este campo es requerido.'
    }),
  fullName: Joi.string()
    .required()
    .messages({
      'any.required': 'Este campo es requerido.'
    }),
  title: Joi.string()
    .required()
    .messages({
      'any.required': 'Este campo es requerido.'
    }),
  message: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'El mensaje debe tener al menos 10 caracteres.',
      'any.required': 'Este campo es requerido.'
    }),
  platform: Joi.string()
    .required()
    .messages({
      'any.required': 'Este campo es requerido.'
    }),
});
