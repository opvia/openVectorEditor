import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
import uuid from "uniqid";
import omit from "lodash/omit";

// ------------------------------------
// Actions
// ------------------------------------
export const updateGuides = createAction("updateGuides");
export const deleteGuides = createAction("deleteGuides");
export const clearGuides = createAction("updateGuides");
// ------------------------------------
// Reducer
// ------------------------------------

export default createMergedDefaultStateReducer(
  {
    [updateGuides]: (state, payload) => {
      //guides should be 0-based inclusive! aka start: 0, end: 0 is a single basepair feature starting at the first bp
      const idToUse = payload.id || uuid();
      return {
        ...state,
        guides: {
          ...state.guides,
          [idToUse]: { ...(state[idToUse] || {}), ...payload, id: idToUse }
        }
      };
    },
    [deleteGuides]: (state, payload) => {
      let ids;
      if (Array.isArray(payload)) {
        ids = payload.map(val => {
          return val.id || val;
        });
      } else {
        ids = [payload.id || payload];
      }
      return { guides: omit(state.guides, ids) };
    },
    [clearGuides]: () => {
      return { guides: {} };
    }
  },
  {
    options: {},
    guides: {}
  }
);
