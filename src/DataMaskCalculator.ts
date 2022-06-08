import { ErrorObject } from "ajv";
import jsonpointer from "jsonpointer";

export interface IMaskOptions {
    readonly shouldMaskTypeErrors?: boolean;
}

enum ValidMaskErrorOperations {
    AdditionalProperties = "additionalProperties",
    TypeError = "type",
}

export class DataMaskCalculator {
    public get Result() {
        return this.data;
    }

    public constructor(private data: object, private readonly options: IMaskOptions) {}

    public HandleValidationError = (error: ErrorObject) => {
        const { keyword, params } = error;
        console.log(error);
        switch (keyword) {
            case ValidMaskErrorOperations.AdditionalProperties:
                this.handleAdditionalProperty(params);
                break;
            case ValidMaskErrorOperations.TypeError:
                this.handleTypeError(params);
                break;
            default:
                throw new Error(`Unhandled mask operation: ${JSON.stringify(error)}`);
        }
    };

    private handleAdditionalProperty = (params: Record<"additionalProperty", string>) => {
        this.maskProperty(params.additionalProperty);
    };

    private handleTypeError = (params: Record<"type", string>) => {
        const shouldMaskTypeErrors = this?.options?.shouldMaskTypeErrors ?? true;
        if (shouldMaskTypeErrors) {
            this.maskProperty(params.type);
        }
    };

    private maskProperty = (property: string) => {
        const { [property]: _, ...result } = this.data as any;
        this.data = result;
    };

    private maskPropertyFromJSONPointer = (jsonPointer: string) => {
        const pointer = jsonpointer.compile(jsonPointer);
        pointer.set(this.data, undefined);
    };
}
