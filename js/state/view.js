export const view = {
  selectedCategory: null,
};

export function selectCategory(id) {
  if (view.selectedCategory === id) {
    view.selectedCategory = null;
  } else {
    view.selectedCategory = id;
  }
}

export function closeCategory() {
  view.selectedCategory = null;
}
