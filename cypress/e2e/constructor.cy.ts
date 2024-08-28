/// <reference types="cypress" />

describe('Проверка добавления ингредиентов', () => {
    beforeEach(() => {
        // Перехват запроса на получение ингредиентов и подмена его фикстурой
        cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

        // Перехват запроса на получение данных пользователя и подмена его фикстурой
        cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');

        // Установка токена аутентификации в localStorage перед загрузкой страницы
        window.localStorage.setItem('refreshToken', 'testRefreshToken');
        cy.setCookie('accessToken', 'testAccessToken');

        // Открытие главной страницы
        cy.visit('/');

        // Ожидание загрузки данных с сервера
        cy.wait('@getIngredients');
        cy.wait('@getUser');
    });

    it('сервис должен быть доступен по адресу localhost:4000', () => {
        // Проверка, что URL страницы соответствует ожидаемому
        cy.url().should('eq', 'http://localhost:4000/');
    });

    it('есть возможность добавлять ингредиенты', () => {
        // Проверка наличия начальных текстов перед добавлением ингредиентов
        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');

        // Использование команды для добавления первой булки
        cy.addFirstBun();
        // Проверка, что текст "Выберите булки" исчез после добавления булки
        cy.contains('Выберите булки').should('not.exist');

        // Использование команды для добавления первого основного ингредиента
        cy.addFirstMainIngredient();
        // Проверка, что текст "Выберите начинку" исчез после добавления начинки
        cy.contains('Выберите начинку').should('not.exist');
    });

    it('открытие модального окна ингредиента', () => {
        // Открытие модального окна ингредиента
        cy.openIngredientModal();
        // Проверка, что модальное окно открыто
        cy.get('[data-cy="ingredient-modal"]').should('be.visible');
    });

    it('закрытие по иконке модального окна ингредиента', () => {
        // Открытие модального окна ингредиента
        cy.openIngredientModal();
        cy.get('[data-cy="ingredient-modal"]').should('be.visible');

        // Закрытие модального окна по иконке
        cy.closeModal();
        // Проверка, что модальное окно закрыто
        cy.get('[data-cy="ingredient-modal"]').should('not.exist');
    });

    it('закрытие по оверлею модального окна ингредиента', () => {
        // Открытие модального окна ингредиента
        cy.openIngredientModal();
        cy.get('[data-cy="ingredient-modal"]').should('be.visible');

        // Закрытие модального окна по оверлею
        cy.closeOverlayModal();
        // Проверка, что модальное окно закрыто
        cy.get('[data-cy="ingredient-modal"]').should('not.exist');
    });

    it('есть возможность добавлять ингредиенты и успешно создавать заказ', () => {
        // Добавление ингредиентов в конструктор
        cy.addFirstBun();
        cy.addFirstMainIngredient();
        cy.contains('Выберите начинку').should('not.exist');

        // Перехват запроса на создание заказа и подмена его фикстурой
        cy.intercept('POST', '/api/orders', { fixture: 'createOrder.json' }).as('createOrder');
        // Отправка заказа
        cy.get('[data-cy="submit-order"]').click();

        // Ожидание завершения запроса на создание заказа
        cy.wait('@createOrder');
        // Проверка, что открылось модальное окно с номером заказа
        cy.get('[data-cy="order-modal"]').should('be.visible');
        cy.get('[data-cy="new-order-number"]').should('be.visible');

        // Закрытие модального окна
        cy.closeModal();

        // Проверка, что модальное окно закрыто и конструктор пуст
        cy.get('[data-cy="order-modal"]').should('not.exist');
        cy.get('[data-cy="constructor-bun"]').should('not.exist');
        cy.get('[data-cy="constructor-main"]').should('not.exist');
        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');
    });
});