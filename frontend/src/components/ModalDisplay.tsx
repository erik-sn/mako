import { connect } from 'react-redux';
import { IStore } from '../interfaces/redux';

interface IProps { modal: JSX.Element; }

export const ModalDisplay = ({ modal }: IProps): JSX.Element => modal;

export const mapStateToProps = (state: IStore) => ({ modal: state.display.modal });

export default connect<IProps, {}, {}>(mapStateToProps)(ModalDisplay);
