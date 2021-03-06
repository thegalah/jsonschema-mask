import Ajv, { Schema } from "ajv";
import { DataMaskCalculator, IMaskOptions } from "./DataMaskCalculator";

const ajv = new Ajv({ allErrors: true });

export const maskData = (jsonSchema: Schema, data: unknown, options: IMaskOptions = {}) => {
    if (typeof data !== "object") {
        throw new Error("maskData only accepts data of type object");
    }
    const validate = ajv.compile(jsonSchema);
    const valid = validate(data);
    if (!valid) {
        const calculator = new DataMaskCalculator(data, options);
        validate.errors?.forEach((error) => {
            calculator.HandleValidationError(error);
        });
        return calculator.Result;
    }
    return data;
};
