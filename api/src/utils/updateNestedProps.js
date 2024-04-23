export default function updateNestedProps(propertyName, valuesToUpdate){
    const keys = Object.keys(valuesToUpdate);
    const updateOptions = {};
    for(const key of keys){
        updateOptions[`${propertyName}.${key}`] = valuesToUpdate[key];
    }

    return updateOptions
}