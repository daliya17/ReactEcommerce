export function loadCategories() {
    return (dispatch) => {
        dispatch({ type: "LOAD_CATEGORY_START" });
        fetch("https://run.mocky.io/v3/297308ac-aeb0-4e98-8868-9c1d3a878a4c")
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                dispatch({ type: "LOAD_CATEGORY_DONE", payload: res })
            })
    }
}

function categoryReducer(state = { isLoading: true, categories: [] }, action) {
    switch (action.type) {
        case "LOAD_CATEGORY_START": {
            return {
                ...state,
                isLoading: true
            };
        }
        case "LOAD_CATEGORY_DONE": {
            return {
                ...state,
                isLoading: false,
                categories: action.payload
            };
        }
        default:
            return state;
    }
}

export default categoryReducer;
