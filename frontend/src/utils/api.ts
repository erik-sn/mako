import axios, { AxiosPromise, AxiosResponse } from 'axios';

import { BASE, API } from '../sagas/types';
import { IMap } from '../interfaces/general';
import GoogleSearch from '@/models/GoogleSearch';

class Api {
  private base: string;

  constructor(base: string) {
    this.base = base;
  }

  public parseErrorFromResponse = (response: AxiosResponse): IMap<string[]> => {
    if (response.status === 500) {
      return {
        generic: [
          'There was an unknown error with the requested action - please contact an administrator',
        ],
      };
    }
    return response.data;
  };
  // authentication endpoints
  public getAuthToken = (username: string, password: string): AxiosPromise =>
    axios.post(`${BASE}/api/token/`, { username, password });

  public refreshAuthToken = (token: string): AxiosPromise =>
    axios.post(`${BASE}/api/token/refresh/`, { refresh: token });

  // general endpoints
  public status = (): AxiosPromise => axios.get(`${this.base}/watchman/`);

  // classifiers
  public fetchClassifiers = (): AxiosPromise => axios.get(`${this.base}/classifiers/`);
  public createClassifier = (json: IMap<any>): AxiosPromise =>
    axios.post(`${this.base}/classifiers/`, json);
  public updateClassifier = (id: number, json: IMap<any>): AxiosPromise =>
    axios.put(`${this.base}/classifiers/${id}/`, json);
  public deleteClassifier = (id: number): AxiosPromise =>
    axios.delete(`${this.base}/classifiers/${id}/`);

  // searches
  public retrieveGoogleSearch = (id: string): AxiosPromise =>
    axios.get(`${this.base}/google_searches/${id}/`);

  public fetchGoogleSearches = (): AxiosPromise => axios.get(`${this.base}/google_searches/`);

  public createGoogleSearch = (json: IMap<any>): AxiosPromise =>
    axios.post(`${this.base}/google_searches/`, json);

  public updateGoogleSearch = (id: number, json: IMap<any>): AxiosPromise =>
    axios.put(`${this.base}/google_searches/${id}/`, json);

  public deleteGoogleSearch = (id: number): AxiosPromise =>
    axios.delete(`${this.base}/google_searches/${id}/`);

  public mergeSearches = (json: IMap<any>) =>
    axios.post(`${this.base}/google_searches/merge/`, json);

  public downloadImages = (endpoint: string, id: number): void => {
    const url = `${this.base}/${endpoint}/${id}/download_images/`;
    const a = document.createElement('a');
    document.body.appendChild(a);
    // a.style = 'display: none';
    a.href = url;
    a.download = url;
    a.click();
    document.body.removeChild(a);
  }

  // upload events
  public fetchUploadEvents = (): AxiosPromise => axios.get(`${this.base}/upload_events/`);

  public retrieveUploadEvent = (id: string): AxiosPromise =>
    axios.get(`${this.base}/upload_events/${id}/`);

  public deleteUploadEvent = (id: number): AxiosPromise =>
    axios.delete(`${this.base}/upload_events/${id}/`);

  public mergeUploads = (json: IMap<any>) => axios.post(`${this.base}/upload_events/merge/`, json);

  // images
  public toggleImageIncluded = (name: string): AxiosPromise =>
    axios.put(`${this.base}/images/${name}/toggle/`);

  // image groups
  public createImageGroup = (json: IMap<any>): AxiosPromise =>
    axios.post(`${this.base}/imagegroups/`, json);

  public fetchImageGroups = (): AxiosPromise => axios.get(`${this.base}/image_groups/`);

  public deleteImageGroup = (id: number): AxiosPromise =>
    axios.delete(`${this.base}/image_groups/${id}/`);
}

export default new Api(API);

interface IError {
  [key: string]: string[];
}

export function processError(response: IError): string[] {
  const keys = Object.keys(response);
  return keys.reduce((store: string[], key: string) => {
    const messages = response[key].map(m => `${key}: ${m}`);
    return store.concat(messages);
  }, []);
}
