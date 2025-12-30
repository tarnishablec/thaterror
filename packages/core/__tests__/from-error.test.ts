import { describe, expect, test } from 'bun:test'
import { enroll } from '@ferror/core'
import { HTTPException } from 'hono/http-exception'
import { AppError } from './define-error.test'

class MyCustomError extends Error {
}


describe('ErrorFamily from native error testing', () => {
    test('should chain up error family', () => {
        const family = enroll(
            AppError, HTTPException, (e) => {
                return AppError.NotFound(1, { cause: e })
            })

        const httpException = new HTTPException(404, { message: 'Not Found' })
        const err = family.from(httpException);
        expect(err.cause).toBe(httpException)


        const exFamily = enroll(
            family, MyCustomError, (e) => {
                return family.Unauthorized({ cause: e })
            });

        expect(exFamily.from(new MyCustomError()).cause).toBeInstanceOf(MyCustomError)

        // expect(error).toBeInstanceOf(AppError)
        // expect(error.code).toBe('NotFound')
        // expect(error.message).toBe('Not Found')
    })
})
