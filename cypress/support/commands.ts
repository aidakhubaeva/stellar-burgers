/// <reference types="cypress" />

// Добавляем команду для клика по кнопке "Добавить"
Cypress.Commands.add('clickAddButton', () => {
    cy.get('button').contains('Добавить').click(); // Находим кнопку с текстом "Добавить" и кликаем по ней
});

// Добавляем команду для открытия модального окна ингредиента
Cypress.Commands.add('openIngredientModal', () => {
    cy.get('[data-cy="ingredient"]').first().click(); // Находим первый ингредиент и кликаем по нему, чтобы открыть модальное окно
});

// Добавляем команду для закрытия модального окна через иконку закрытия
Cypress.Commands.add('closeModal', () => {
    cy.get('[data-cy="modal-close"]').click(); // Находим иконку закрытия и кликаем по ней
});

// Добавляем команду для закрытия модального окна по клику на оверлей
Cypress.Commands.add('closeOverlayModal', () => {
    // Находим оверлей закрытия и кликаем по нему с использованием опции { force: true }
    cy.get('[data-cy="modal-close-overlay"]').click({ force: true });
});

// Добавляем команду для добавления первой булки в конструктор
Cypress.Commands.add('addFirstBun', () => {
    cy.get('[data-cy="ingredient"][data-type="bun"]').first().within(() => {
        cy.clickAddButton(); // Используем ранее определённую команду для клика по кнопке "Добавить"
    });
});

// Добавляем команду для добавления первого основного ингредиента в конструктор
Cypress.Commands.add('addFirstMainIngredient', () => {
    cy.get('[data-cy="ingredient"][data-type="main"]').first().within(() => {
        cy.clickAddButton(); // Используем ранее определённую команду для клика по кнопке "Добавить"
    });
});


// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//       // Добавьте здесь вашу кастомную команду
//       setIntercepts(): Chainable<void>;
//     }
//   }
// }