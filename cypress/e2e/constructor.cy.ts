/// <reference types="cypress" />

describe('Проверка добавления ингредиентов', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');

        // Установите токен аутентификации в localStorage перед загрузкой страницы
        window.localStorage.setItem('refreshToken', 'testRefreshToken');
        cy.setCookie('accessToken', 'testAccessToken');

        cy.visit('/'); // Открытие страницы

        // Ожидание загрузки данных
        cy.wait('@getIngredients');
        cy.wait('@getUser');
    });

    it('сервис должен быть доступен по адресу localhost:4000', () => {
        cy.url().should('eq', 'http://localhost:4000/'); // Проверка, что URL правильный
    });

    it('есть возможность добавлять ингредиенты', () => {
        // Проверяем наличие начальных текстов перед добавлением ингредиентов
        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');

        // Кликаем по кнопке "Добавить" в первом ингредиенте типа "bun"
        cy.get('[data-type="bun"]').first().within(() => {
            cy.get('button').contains('Добавить').click();
        });

        // Убедиться, что текст "Выберите булки" больше не существует
        cy.contains('Выберите булки').should('not.exist');

        // Кликаем по кнопке "Добавить" в первом ингредиенте типа "main"
        cy.get('[data-type="main"]').first().within(() => {
            cy.get('button').contains('Добавить').click();
        });

        // Убедиться, что текст "Выберите начинку" больше не существует
        cy.contains('Выберите начинку').should('not.exist');
    });

    it('открытие модального окна ингредиента', () => {
        // Находим первый ингредиент и кликаем на него
        cy.get('[data-cy="ingredient"]').first().click();
        cy.get('[data-cy="ingredient-modal"]').should('be.visible');
    });

    it('закрытие по иконке модального окна ингредиента', () => {
        cy.get('[data-cy="ingredient"]').first().click();
        cy.get('[data-cy="ingredient-modal"]').should('be.visible');

        // Закрываем модальное окно по иконке закрытия
        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="ingredient-modal"]').should('not.exist');
    });

    it('закрытие по оверлею модального окна ингредиента', () => {
        cy.get('[data-cy="ingredient"]').first().click();
        cy.get('[data-cy="ingredient-modal"]').should('be.visible');

        cy.get('[data-cy="modal-close-overlay"]').click({ force: true });
        cy.get('[data-cy="ingredient-modal"]').should('not.exist');
    });

    it('есть возможность добавлять ингредиенты и успешно создавать заказ', () => {
        // Добавление ингредиентов
        cy.get('[data-cy="ingredient"][data-type="bun"]').first().within(() => {
            cy.get('button').contains('Добавить').click();
        });

        cy.get('[data-cy="ingredient"][data-type="main"]').first().within(() => {
            cy.get('button').contains('Добавить').click();
        });

        // Убедиться, что текст "Выберите начинку" больше не существует
        cy.contains('Выберите начинку').should('not.exist');

        // Мокаем запрос на создание заказа
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'createOrder.json' }).as('createOrder');

        // Отправка заказа
        cy.get('[data-cy="submit-order"]').click();

        // Проверка, что открылось модальное окно с номером заказа
        cy.wait('@createOrder');
        cy.get('[data-cy="order-modal"]').should('be.visible');
        cy.get('[data-cy="new-order-number"]').should('be.visible');

        // Закрытие модального окна
        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="order-modal"]').should('not.exist');

        // Проверка, что конструктор пуст
        cy.get('[data-cy="constructor-bun"]').should('not.exist');
        cy.get('[data-cy="constructor-main"]').should('not.exist');
        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');
    });
});