export const ErrorBrand: unique symbol = Symbol("FErrorBrand");

export interface DefinedError<
    Code extends string = string,
    Payload = unknown
> extends Error {
    readonly [ErrorBrand]: true;
    readonly code: Code;
    readonly payloads: Payload;
    readonly scope: symbol;
}

export type ErrorSpec =
    | string
    | ((...args: never[]) => string);

export type ErrorMap = Record<string, ErrorSpec>;


export type ErrorCase<K extends string, S extends ErrorSpec> =
    (S extends (...args: infer A) => string
        ? (...args: A) => DefinedError<K, A>
        : (options?: { cause?: unknown }) => DefinedError<K, void>)
    & { readonly code: K; readonly scope: symbol };

export type ErrorFamily<M extends ErrorMap> = {
    readonly [K in keyof M & string]: ErrorCase<K, M[K]>;
};


export type ErrorOf<F extends ErrorFamily<ErrorMap>> = ReturnType<F[keyof F & string]>;
