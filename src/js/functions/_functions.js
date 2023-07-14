"use strict";

/**
 * Найти максимальное значение в массиве
 * @param array
 * @returns {number}
 */
const getMaxInArray = array => Math.max(array);

/**
 * Найти минимальное значение в массиве
 * @param array
 * @returns {number}
 */
const getMinInArray = array => Math.min(array);

/**
 * Сгенерировать случайное число от 1 до number:
 * @param number
 * @returns {number}
 */
const getRandomNumberInRange = number => Math.floor(Math.random() * number) + 1;

/**
 * Проверить, является ли строка валидным числом:
 * @param string
 * @returns {boolean}
 */
const isValidNumber = (string) => !isNaN(parseFloat(string));

/**
 * Получить текущую дату и время:
 */
const getCurrentDateTime = () => new Date().toString();

/**
 * Проверить, является ли переменная массивом:
 * @param variable
 * @returns {arg is any[]}
 */
const isArray = variable => !!(Array.isArray(variable));

/**
 * Проверить, является ли переменная объектом:
 * @param variable
 * @returns {boolean}
 */
const isObject = variable => (typeof variable === "object");

/**
 * Преобразовать массив в строку:
 * @param array
 * @returns {*}
 */
const getStringFromArray = array => array.join(",");

/**
 * Проверить, является ли переменная функцией:
 * @param variable
 * @returns {boolean}
 */
const isFunction = variable => (typeof variable === "function");

/**
 *  Преобразовать объект в массив:
 * @param object
 * @returns {unknown[]}
 */
const objectIntoArray = object => Object.values(object);

/**
 * Посчитать вхождения элемента в массиве:
 * @param element
 * @param array
 * @returns {*}
 */
const countEqualInArray = (element, array) => array.filter(x => x === element).length;

/**
 * Проверить, является ли строка палиндромом:
 * @param string
 * @returns {boolean}
 */
const isPalindrome = (string) => (string === string.split("").reverse().join(""));

/**
 * Получить сумму всех чисел в массиве
 * @param array
 * @returns {*}
 */
const getSumOfArray = (array) => array.reduce((a, b) => a + b, 0);

/**
 * Получить текущую метку времени
 * @returns {number}
 */
const getNowTimeStamp = () => Date.now();

/**
 * Проверить, является ли переменная null:
 * @param variable
 * @returns {boolean}
 */
const isNull = (variable) => (variable === null);

/**
 * Проверить, является ли переменная undefined:
 * @param variable
 * @returns {boolean}
 */
const isUndefined = (variable) => (typeof variable === "undefined");

/**
 * Проверить, пуст ли массив:
 * @param array
 * @returns {boolean}
 */
const isEmptyArray = (array) => (array.length === 0)

/*
//Создать новый объект с динамическим ключом и значением:
{ [key]: value }

// Создать новый массив с определенным диапазоном чисел:
Array.from({ length: n }, (_, i) => i)*/
