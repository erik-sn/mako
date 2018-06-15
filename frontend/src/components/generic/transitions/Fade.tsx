import * as React from 'react';
import Transition from 'react-transition-group/Transition';

interface IProps { in: boolean; duration?: number; }

class Fade extends React.Component<IProps, {}> {
  public static defaultProps: any = {
    duration: 300,
  };

  public render(): JSX.Element {
    const { in: inProp, children, duration } = this.props;
    return (
      <Transition timeout={duration} in={inProp} >
        {(status: string) => {
          return (
            <div className={`fade fade--${duration}--${status}`}>
              {children}
            </div>
          );
        }}
      </Transition>
    );
  }
}

export default Fade;
