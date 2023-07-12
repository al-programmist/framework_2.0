"use strict";

/**
 * Найти максимальное значение в массиве
 * @param array
 * @returns {number}
 */
const maxInArray = array => Math.max(array);

/**
 * Найти минимальное значение в массиве
 * @param array
 * @returns {number}
 */
const minInArray = array => Math.min(array);

/**
 * Сгенерировать случайное число от 1 до number:
 * @param number
 * @returns {number}
 */
const randomInRange = number => Math.floor(Math.random() * number) + 1;

/**
 * Проверить, является ли строка валидным числом:
 * @param string
 * @returns {boolean}
 */
const isValidNumber = (string) => !isNaN(parseFloat(string));

/**
 * Получить текущую дату и время:
 */
const currentDateTime = () => new Date().toString();

/**
 * Проверить, является ли переменная массивом:
 * @param variable
 * @returns {arg is any[]}
 */
const isArray = variable => Array.isArray(variable);

/**
 * Проверить, является ли переменная объектом:
 * @param variable
 * @returns {boolean}
 */
const isObject = variable => typeof variable === "object";

/**
 * Преобразовать массив в строку:
 * @param array
 * @returns {*}
 */
const join = array => array.join(",");

/**
 * Проверить, является ли переменная функцией:
 * @param variable
 * @returns {boolean}
 */
const isFunction = variable => typeof variable === "function";

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

/*
//Создать новый объект с динамическим ключом и значением:
{ [key]: value }

// Проверить, является ли строка палиндромом:
string === string.split("").reverse().join("");

//Получить сумму всех чисел в массиве:
array.reduce((a, b) => a + b, 0));

// Получить текущую метку времени:
Date.now()

//Проверить, является ли переменная null:
variable === null

//Проверить, является ли переменная undefined:
typeof variable === "undefined"

// Проверить, пуст ли массив:
array.length === 0

// Создать новый массив с определенным диапазоном чисел:
Array.from({ length: n }, (_, i) => i)*/
