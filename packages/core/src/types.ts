export const ErrorBrand: unique symbol = Symbol("FErrorBrand");
export const ScopeField: unique symbol = Symbol("FErrorScope");
export const PayloadField: unique symbol = Symbol("FErrorPayload");
export const CodeField: unique symbol = Symbol("FErrorCode");

export interface DefinedError<
    Code extends string = string,
    Payload extends readonly unknown[] = readonly unknown[]
> extends Error {
    readonly [ ErrorBrand ]: true;
    readonly [ ScopeField ]: symbol;
    readonly [ PayloadField ]: Payload;
    readonly [ CodeField ]: Code;
}

export type ErrorSpec =
    | string
    /**
     * Uses `never[]` to leverage contravariance, ensuring it can
     * serve as a base type for functions with any parameter types.
     */
    | ((...args: never[]) => string);

export type ExtractPayload<S extends ErrorSpec> =
    S extends (...args: infer A) => string
        ? A
        : never[];

export type ErrorMap = Record<string, ErrorSpec>;


export type ErrorCase<K extends string, S extends ErrorSpec> =
    ([S] extends [(...args: infer A) => string]
        ? (...args: [...args: A, options?: ErrorOptions]) => DefinedError<K, A>
        : (options?: ErrorOptions) => DefinedError<K, never[]>)
    & { readonly [ CodeField ]: K; readonly [ ScopeField ]: symbol };

export type ErrorFamily<M extends ErrorMap> = {
    readonly [K in keyof M & string]: ErrorCase<K, M[K]>;
} & {
    readonly [ ScopeField ]: symbol;
};

export type ErrorUnionOf<F> =
    F extends EnrolledErrorFamily<infer _EM, infer _Es> | ErrorFamily<infer _M>
        ? ReturnType<F[keyof F & string]>
        : never;


const TransformersField = Symbol("FErrorEnrollTransformers");

export type EnrolledErrorFamily<M extends ErrorMap, Es extends readonly Error[] = []> =
    (ErrorFamily<M> & {
        readonly [ TransformersField ]: Map<new(...args: never[]) => Es[number], (error: Es[number]) => ErrorUnionOf<ErrorFamily<M>>>;
        from(error: Es[number]): ErrorUnionOf<ErrorFamily<M>>;
    });


export type ErrorMapOf<F> =
    F extends EnrolledErrorFamily<infer EM, infer _Es> ? EM :
        F extends ErrorFamily<infer M>
            ? M
            : never;
