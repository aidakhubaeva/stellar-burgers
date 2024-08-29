/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        intercept(
            method: string,
            url: string | RegExp,
            response: any
        ): Chainable<null>;
    }

    function env(key: string): any;
    function on(eventName: string, fn: (...args: any[]) => void): void;
}