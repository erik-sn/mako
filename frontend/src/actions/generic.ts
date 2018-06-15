import { IAction } from '../interfaces/redux';

// const TYPES: any = types;

interface IApiTypes {
  setActive: string;
  retrieve: string;
  retrieveSuccess: string;
  retrieveFailure: string;
  fetch: string;
  fetchSuccess: string;
  fetchFailure: string;
  create: string;
  createSuccess: string;
  createFailure: string;
  update: string;
  updateSuccess: string;
  updateFailure: string;
  delete: string;
  deleteSuccess: string;
  deleteFailure: string;
}

class ApiActions {
  private model: string;
  public types: IApiTypes;

  constructor(model: string) {
    this.model = model.toUpperCase();
    this.types = {
      setActive: `SET_ACTIVE_${this.model}`,
      retrieve: `RETRIEVE_${this.model}`,
      retrieveSuccess: `RETRIEVE_${this.model}_SUCCESS`,
      retrieveFailure: `RETRIEVE_${this.model}_FAILURE`,
      fetch: `FETCH_${this.model}`,
      fetchSuccess: `FETCH_${this.model}_SUCCESS`,
      fetchFailure: `FETCH_${this.model}_FAILURE`,
      create: `CREATE_${this.model}`,
      createSuccess: `CREATE_${this.model}_SUCCESS`,
      createFailure: `CREATE_${this.model}_FAILURE`,
      update: `UPDATE_${this.model}`,
      updateSuccess: `UPDATE_${this.model}_SUCCESS`,
      updateFailure: `UPDATE_${this.model}_FAILURE`,
      delete: `UPDATE_${this.model}`,
      deleteSuccess: `UPDATE_${this.model}_SUCCESS`,
      deleteFailure: `UPDATE_${this.model}_FAILURE`,
    };
  }

  public setActive = (id: number): IAction<number> => ({
    type: this.types.setActive,
    payload: id,
  });

  public retrieve = (id: number): IAction<number> => ({
    type: this.types.retrieve,
    payload: id,
  });

  public fetch = () => ({
    type: this.types.fetch,
  });

  public create = (postData: {}) => ({
    type: this.types.create,
    payload: postData,
  });

  public update = (id: number, putData: {}) => ({
    type: this.types.update,
    payload: { id, putData },
  });

  public delete = (id: number) => ({
    type: this.types.delete,
    payload: id,
  });
}

export default ApiActions;
