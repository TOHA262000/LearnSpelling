const formatCategoryName = (camelCase) => {
    // Insert a space before capital letters and capitalize the first letter
    return camelCase
        .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
};
export default formatCategoryName;