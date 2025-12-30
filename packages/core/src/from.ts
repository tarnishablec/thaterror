import type { ErrorFamily, ErrorMap, ErrorMapOf, ErrorUnionOf } from "./types";

const TransformersField = Symbol("FErrorEnrollTransformers");

export type EnrolledErrorFamily<M extends ErrorMap, Es extends readonly Error[] = []> =
    (ErrorFamily<M> & {
        readonly [ TransformersField ]: Map<Es[number], (error: Es[number]) => ErrorUnionOf<ErrorFamily<M>>>;
        from(error: Es[number]): ErrorUnionOf<ErrorFamily<M>>;
    });

export function enroll<
    F,
    const E extends Error,
>(
    errorFamily:
    F extends EnrolledErrorFamily<ErrorMapOf<F>, infer _Es>
        ? F
        : F extends ErrorFamily<ErrorMapOf<F>>
            ? ErrorFamily<ErrorMapOf<F>>
            : never,
    errorClass: new (...args: never[]) => E,
    transformer: (error: E) => ErrorUnionOf<F>
): EnrolledErrorFamily<ErrorMapOf<F>, [...F extends EnrolledErrorFamily<ErrorMapOf<F>, infer Es> ? Es : [], E]> {


    throw new Error("Not implemented");
}