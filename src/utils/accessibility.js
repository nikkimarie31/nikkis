export const focusOnElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.focus();
    }
};
