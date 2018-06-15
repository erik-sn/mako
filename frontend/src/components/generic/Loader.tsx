import * as React from 'react';
import Typography from '@material-ui/core/Typography';

interface IProps {
  size?: number;
  fill?: string;
  label?: string;
  left?: boolean;
  marginLeft?: string;
  marginTop?: string;
  className?: string;
}

class Loader extends React.PureComponent<IProps, {}> {
  public static defaultProps: IProps = {
    size: 100,
    fill: '#16191f',
    label: '',
    left: false,
    marginLeft: '0px',
    marginTop: '10vh',
  };

  public render(): JSX.Element {
    const { size, fill, label, left, marginLeft, marginTop, className } = this.props;
    return (
      <div
        className={`loader ${className}`}
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: left ? 'flex-start' : 'center',
          justifyContent: left ? 'flex-start' : 'center',
          marginTop,
          marginLeft,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 38 38" stroke={fill}>
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
        {label && (
          <Typography variant="display1" style={{ marginTop: '15px' }}>
            {label}
          </Typography>
        )}
      </div>
    );
  }
}

export default Loader;
