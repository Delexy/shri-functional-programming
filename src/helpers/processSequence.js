/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import Api from '../tools/api';
import {__, allPass, andThen, assoc, compose, concat, gt, ifElse, length, lt, mathMod, otherwise, partial, prop, tap, test} from "ramda";

const api = new Api();
const API_NUMBERS_URL = 'https://api.tech/numbers/base';
const API_ANIMALS_URL = 'https://animals.tech/';

// Вспомогательные
const gtTwo = gt(__, 2);
const ltTen = lt(__, 10);
const thenSquare = andThen((num) => Math.pow(num, 2));

// Проверки
const stringLengthMoreTwo = compose(gtTwo, length);
const stringLengthLowerTen = compose(ltTen, length);
const onlyNumbers = test(/^[0-9]+.?[0-9]+$/);
const stringToNumber = num => +num;

const modForThreeToString = compose(String, mathMod(__, 3));
const thenModOfThreeToString = andThen(modForThreeToString);
const thenGetLength = andThen(length);

// Общая валидация строки
const validate = allPass([stringLengthMoreTwo, stringLengthLowerTen, onlyNumbers]);

// Общие функции
const getResultFromAPI = compose(String, prop('result'));
const toBinary = assoc('number', __, { from: 10, to: 2 });
const apiGetNumberBinaryBase = compose(
    api.get(API_NUMBERS_URL),
    toBinary
) ;

const thenGetApiResult = andThen(getResultFromAPI);
const thenConcatToAnimalsUrl = andThen(concat(API_ANIMALS_URL));
const thenGet = andThen(api.get(__, {}));

const processSequence = ({value, writeLog, handlerSuccess, handlerError}) => {
    const tapLog = tap(writeLog);
    const thenTapLog = andThen(tapLog);
    const thenHandlerSuccess = andThen(handlerSuccess);
    const otherwiseHandlerError = otherwise(handlerError);

    const handleValidationError = partial(handlerError, ['Error']);

    const sequenceComposition = compose(
        otherwiseHandlerError,
        thenHandlerSuccess,
        thenGetApiResult,
        thenGet,
        thenConcatToAnimalsUrl,
        thenTapLog,
        thenModOfThreeToString,
        thenTapLog,
        thenSquare,
        thenTapLog,
        thenGetLength,
        thenTapLog,
        thenGetApiResult,
        apiGetNumberBinaryBase,
        tapLog,
        stringToNumber,
    );

    const runWithCondition = ifElse(validate, sequenceComposition, handleValidationError);
    const logAndRunSequence = compose(runWithCondition, tapLog);

    logAndRunSequence(value);
};

export default processSequence;
