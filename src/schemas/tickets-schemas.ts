import Joi from "joi";

export const tickeTypeIdSchema = Joi.object({
  tickeTypeId: Joi.number().required()
});
