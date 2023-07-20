/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { __, any, countBy, filter, identity, not, propEq, values, allPass, compose, prop, equals, gte } from 'ramda';

const amountOfColors = compose(countBy(identity), values);

const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');

const isRed = equals('red');
const isWhite = equals('white');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');

const starIsRed = compose(isRed, getStar);
const starIsNotRed = compose(not, isRed, getStar);
const starIsNotWhite = compose(not, isWhite, getStar);
const squareIsGreen = compose(isGreen, getSquare);
const triangleIsWhite = compose(isWhite, getTriangle);
const triangleIsGreen = compose(isGreen, getTriangle);
const circleIsWhite = compose(isWhite, getCircle);
const circleIsBlue = compose(isBlue, getCircle);
const squareIsOrange = compose(isOrange, getSquare);

const gte2 = gte(__, 2);
const gte3 = gte(__, 3);
const anyGte3 = any(gte3);

const redEq1 = compose(propEq('red', 1), amountOfColors);
const greenEq2 = compose(propEq('green', 2), amountOfColors);
const orangeEq4 = compose(propEq('orange', 4), amountOfColors);
const greenEq4 = compose(propEq('green', 4), amountOfColors);

const getGreenColorsAmount = (colors) => {
  return filter(isGreen, values(colors)).length;
};
const getBlueColorsAmount = (colors) => {
  return filter(isBlue, values(colors)).length;
};
const getRedColorsAmount = (colors) => {
  return filter(isRed, values(colors)).length;
};
const redEqualsBlue = ({ red, blue }) => blue === red;
const getRedAndBlue = (colors) => {
  return {
    red: getRedColorsAmount(colors),
    blue: getBlueColorsAmount(colors),
  };
};
const removeWhiteColor = (colors) => {
  delete colors['white'];
  return colors;
}
const triangleEqSquareNotWhite = ({triangle, square}) => triangle === square && triangle !== 'white' && square !== 'white';


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([starIsRed, squareIsGreen, triangleIsWhite, circleIsWhite]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gte2, getGreenColorsAmount);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(redEqualsBlue, getRedAndBlue);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([circleIsBlue, starIsRed, squareIsOrange]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(anyGte3, values, removeWhiteColor, amountOfColors);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([triangleIsGreen, greenEq2, redEq1]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = orangeEq4;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([starIsNotRed, starIsNotWhite]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = greenEq4;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = triangleEqSquareNotWhite;
