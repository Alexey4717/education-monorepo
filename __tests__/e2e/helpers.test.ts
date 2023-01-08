import {getIsIsoDate, getCorrectIncludesAvailableResolutions} from '../../src/helpers';
import { AvailableResolutions } from '../../src/types';

let dateString: any;
let availableResolutions: any;

beforeEach(() => {
    dateString = '2023-01-08T09:12:33.554Z';
    availableResolutions = [AvailableResolutions.P144]
})

// testing getIsIsoDate function for check validate date ISO string
test('should return true for valid date string', () => {
    const result = getIsIsoDate(dateString)
    expect(result).toBe(true)
})
test('should return false for invalid date string', () => {
    dateString = 1;
    expect(getIsIsoDate(dateString)).toBe(false)

    dateString = 'some string';
    expect(getIsIsoDate(dateString)).toBe(false)

    dateString = new Date();
    expect(getIsIsoDate(dateString)).toBe(false)

    dateString = '2023-01-08';
    expect(getIsIsoDate(dateString)).toBe(false)
})

// testing getCorrectIncludesAvailableResolutions function for validate values of availableResolutions by enum
test('should return false if array availableResolutions include valid values by enum', () => {
    expect(getCorrectIncludesAvailableResolutions(availableResolutions)).toBe(false)
    availableResolutions = [AvailableResolutions.P144, AvailableResolutions.P1080];
    expect(getCorrectIncludesAvailableResolutions(availableResolutions)).toBe(false)
})
test('should return true if array availableResolutions include invalid values by enum', () => {
    availableResolutions = ["P1444"];
    expect(getCorrectIncludesAvailableResolutions(availableResolutions)).toBe(true)
    availableResolutions = [AvailableResolutions.P144, "Some string", AvailableResolutions.P1080];
    expect(getCorrectIncludesAvailableResolutions(availableResolutions)).toBe(true)
})