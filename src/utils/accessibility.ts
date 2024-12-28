export const focusOnElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.focus();
    }
  };
  