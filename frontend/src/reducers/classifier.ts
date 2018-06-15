import { IAction, IClassifierReducer } from '../interfaces/redux';
import Classifier from '../models/Classifier';
import types from '../sagas/types';

export const initialState: IClassifierReducer = {
  classifiers: [],
  activeClassifier: undefined,
};

export default (state: IClassifierReducer = initialState, action: IAction<any>): IClassifierReducer => {
  switch (action.type) {
    case types.SET_ACTIVE_CLASSIFIER: {
      return {
        ...state,
        activeClassifier: state.classifiers.find(c => c.id === action.payload),
      };
    }
    case types.FETCH_CLASSIFIERS_SUCCESS: {
      return {
        ...state,
        classifiers: action.payload.map((c: any) => new Classifier(c)),
      };
    }
    case types.CREATE_CLASSIFIER_SUCCESS: {
      return {
        ...state,
        activeClassifier: undefined,
        classifiers: state.classifiers.concat([ new Classifier(action.payload) ]),
      };
    }
    case types.UPDATE_CLASSIFIER_SUCCESS: {
      const classifier = new Classifier(action.payload);
      return {
        ...state,
        activeClassifier: undefined,
        classifiers: state.classifiers.map(c => c.id === classifier.id ? classifier : c),
      };
    }
    case types.DELETE_CLASSIFIER: {
      return {
        ...state,
        activeClassifier: undefined,
        classifiers: state.classifiers.filter(c => c.id !== action.payload),
      };
    }
    default:
      return state;
  }
};
