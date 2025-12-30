import {
    type DefinedError,
    type ErrorCase,
    type ErrorFamily,
    type ErrorMap,
    type ErrorSpec,
    ScopeField
} from "./types";

export function scopeOfFamily<M extends ErrorMap>(errorFamily: ErrorFamily<M>) {
    return errorFamily[ ScopeField ];
}

export function scopeOfError<E extends DefinedError>(error: E) {
    return error[ ScopeField ];
}

export function scopeOfCase<K extends string, S extends ErrorSpec>(
    errorCase: ErrorCase<K, S>
) {
    return errorCase[ ScopeField ];
}

export function scopeOf(target: { [ ScopeField ]: symbol } | DefinedError) {
    if (typeof target === "function") return scopeOfCase(target);
    if (target instanceof Error) return scopeOfError(target);
    if (typeof target === "object") return scopeOfFamily(target);
    throw new Error("Invalid target");
}