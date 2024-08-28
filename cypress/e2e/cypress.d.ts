/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Перехватывает сетевой запрос
         * @param method - HTTP метод (GET, POST и т.д.)
         * @param url - URL для перехвата
         * @param response - Ответ, который будет возвращён для перехваченного запроса
         */
        intercept(method: string, url: string | RegExp, response: any): Chainable<null>;

        /**
         * Добавить новый ингредиент, нажав на кнопку "Добавить"
         */
        clickAddButton(): Chainable<void>;

        /**
         * Открыть модальное окно для первого ингредиента
         */
        openIngredientModal(): Chainable<void>;

        /**
         * Закрыть модальное окно
         */
        closeModal(): Chainable<void>;

        /**
         * Закрыть модальное окно, кликнув по оверлею
         */
        closeOverlayModal(): Chainable<void>;

        /**
         * Добавить первую булку в конструктор бургера
         */
        addFirstBun(): Chainable<void>;

        /**
         * Добавить первый основной ингредиент в конструктор бургера
         */
        addFirstMainIngredient(): Chainable<void>;

        /**
         * Получить переменные окружения
         * @param key - Ключ переменной окружения
         */
        env(key: string): any;

        /**
         * Добавить слушатель события
         * @param eventName - Название события для прослушивания
         * @param fn - Функция, которая будет выполнена при возникновении события
         */
        on(eventName: string, fn: (...args: any[]) => void): void;
    }
}