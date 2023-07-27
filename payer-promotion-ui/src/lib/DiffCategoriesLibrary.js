/**
 * This module exports a singleton object that holds the diff categories.
 * This object is initialized everytime the diff categories are fetched
 * from the server
 */
class DiffCategoriesLibrary {
  diffCategories = [];
  diffCategoriesMap = {};

  initialize(diffCategories = []) {
    this.diffCategories = diffCategories;
    this.diffCategories.forEach(diffCategory => {
      this.diffCategoriesMap[diffCategory.id] = diffCategory;
    });
  }

  getDiffCategories() {
    return this.diffCategories;
  }

  getDiffCategory(id) {
    return this.diffCategoriesMap[id];
  }

  getCategoryName(id) {
    const diffCategory = this.diffCategoriesMap[id];
    return diffCategory ? diffCategory.name : undefined;
  }
}

export default new DiffCategoriesLibrary();
