import types from '../sagas/types';
import { IAction } from '@/interfaces/redux';

export const toggleImage = (searchId: number, name: string) => {
  const formattedName = name.replace('.', '');
  return { type: types.TOGGLE_IMAGE_INCLUDED, payload: { searchId, formattedName } };
};

export const mergeUploadEvents = (json: any): IAction<any> => {
  return {
    type: types.MERGE_UPLOAD_EVENTS,
    payload: json,
  };
};
