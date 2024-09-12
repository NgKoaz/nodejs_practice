module.exports = {
    isIntegerString: (value) => {
        // The regex checks for an optional leading + or - sign, followed by one or more digits.
        return /^-?\d+$/.test(value);
    }
}