import {type DefinedError, ErrorBrand, type ErrorCase, type ErrorSpec} from "./types";

export function isDefinedError<E extends DefinedError>(
    error: unknown,
    scope?: symbol
): error is E {
    if (!(error instanceof Error) || !(ErrorBrand in error)) {
        return false;
    }

    if (error[ErrorBrand] !== true) return false;
    return !(scope && Reflect.get(error, "scope") !== scope);
}

export function is<K extends string, P extends ErrorSpec>(
    error: unknown,
    errorCase: ErrorCase<K, P>
): error is DefinedError<K, P> {
    if (!isDefinedError(error, errorCase.scope)) {
        return false;
    }

    return error.name === errorCase.code;
}