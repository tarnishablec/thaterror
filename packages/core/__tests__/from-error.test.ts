import { describe, expect, test } from 'bun:test'
import { enroll } from '@ferror/core'
import { HTTPException } from 'hono/http-exception'
import { AppError } from './define-error.test'

describe('ErrorFamily from native error testing', () => {
    test('should chain up error family', () => {
        const family = enroll(
            AppError, HTTPException, (e) => {
                return AppError.NotFound(1, {cause: e})
            })

        const httpException = new HTTPException(404, {message: 'Not Found'})
        const err = family.from(httpException);

        switch (err) {

        }

        expect(err.cause).toBe(httpException)


        // expect(error).toBeInstanceOf(AppError)
        // expect(error.code).toBe('NotFound')
        // expect(error.message).toBe('Not Found')
    })
})
