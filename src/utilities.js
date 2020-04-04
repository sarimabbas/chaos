export const setAllExcept = (
  setOfKeyValuePairs,
  defaultValue,
  exceptionKey,
  exceptionValue
) => {
  Object.keys(setOfKeyValuePairs).forEach(function (key) {
    if (key === exceptionKey) {
      setOfKeyValuePairs[exceptionKey] = exceptionValue;
    } else {
      setOfKeyValuePairs[key] = defaultValue;
    }
  });
};
