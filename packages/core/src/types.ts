export const ErrorBrand: unique symbol = Symbol("FErrorBrand");
export const ScopeField: unique symbol = Symbol("FErrorScope");
export const PayloadField: unique symbol = Symbol("FErrorPayload");
export const CodeField: unique symbol = Symbol("FErrorCode");

export interface DefinedError<
    Code extends string = string,
    Payload extends readonly unknown[] = readonly unknown[]
> extends Error {
    readonly [ErrorBrand]: true;
    readonly [ScopeField]: symbol;
    readonly [PayloadField]: Payload;
    readonly [CodeField]: Code;
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

export type ErrorUnionOfMap<M extends ErrorMap> = {
    [K in keyof M & string]: DefinedError<K, ExtractPayload<M[K]>>;
}[keyof M & string];

export type ErrorCase<K extends string, S extends ErrorSpec> =
    ([S] extends [(...args: infer A) => string]
        ? (...args: [...args: A, options?: ErrorOptions]) => DefinedError<K, A>
        : (options?: ErrorOptions) => DefinedError<K, never[]>)
    & { readonly [CodeField]: K; readonly [ScopeField]: symbol };

export type ErrorFamily<M extends ErrorMap, Es extends readonly (readonly [Error, ErrorUnionOfMap<M>])[] = []> = {
    readonly [K in keyof M & string]: ErrorCase<K, M[K]>;
} & {
    readonly [ScopeField]: symbol;

    /**
     * Enrolls an Error class into the family and associates it with an error case.
     * @param errorClass The constructor of the error (e.g., SyntaxError or a custom class).
     * @param errorCase The variant case from this family.
     * @param args A transformer is REQUIRED if the error case expects a payload.
     */
    enroll<
        T extends { new(...args: never[]): Error; readonly prototype: Error },
        K extends keyof M & string,
        C extends ErrorUnionOfMap<M>,
        E extends Error = InstanceOfError<T>
    >(
        errorClass: T,
        errorCase: ErrorCase<K, M[K]> & ((...args: never[]) => C),
        ...args: ExtractPayload<M[K]> extends [] | never[]
            ? []
            : [transformer: (e: E) => ExtractPayload<M[K]>]
    ): ErrorFamily<M, Upsert<Es, E, C>>;

    from<E extends Es[number][0]>(error: E): Extract<Es[number], readonly [E, unknown]>[1];
};

/**
 * Extracts the specific instance type from an Error constructor.
 *
 * WHY THIS IS NECESSARY:
 *
 * Standard inference like `E extends Error` fails for built-in error types such as
 * - SyntaxError
 * - TypeError
 * - RangeError
 * - ReferenceError
 * * These are not defined as simple 'classes' in TypeScript's core library (lib.d.ts).
 * Instead, they use interface merging with multiple overloads (both newable and callable).
 * In complex generic chains like ErrorFamily, TS often "collapses" these back to the
 * base 'Error' type.
 * * BY ANCHORING TO `readonly prototype`:
 * We bypass the ambiguous constructor overloads and target the unique prototype
 * interface, ensuring that subtype-specific properties (e.g., SyntaxError.lineNumber)
 * are preserved in the transformer.
 */
type InstanceOfError<T> = T extends { readonly prototype: infer P }
    ? P extends Error ? P : Error
    : Error;

/**
 * Updates or inserts a type mapping into the Error Family tuple.
 * We use `Extract<Rest, ...>` to fix TS2344: ensuring the compiler recognizes
 * the recursive tail as a valid tuple array.
 */
type Upsert<T extends readonly (readonly [Error, unknown])[], E extends Error, C> =
    T extends readonly [readonly [infer CurE, infer CurC], ...infer Rest]
        ? CurE extends E
            ? readonly [[E, C], ...Rest]
            : readonly [[CurE, CurC], ...Upsert<Extract<Rest, readonly (readonly [Error, unknown])[]>, E, C>]
        : readonly [[E, C]];

export type ErrorMapOf<F> =
    F extends ErrorFamily<infer M, infer _Es>
        ? M
        : never;

export type ErrorUnionOf<F> =
    F extends ErrorFamily<infer M, infer _Es>
        ? ErrorUnionOfMap<M> : never
