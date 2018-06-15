import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import MasonryInfiniteScroller from 'react-masonry-infinite';

const styles = withStyles<any>(() => ({
  imageContainer: {
    overflowY: 'auto',
  },
  imageList: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
}));

interface IProps {
  children: JSX.Element[];
  classes: any;
  elementHeight: number;
  elementWidth: number;
  containerHeight: number;
}

interface IState {
  elements: JSX.Element[];
}

class Grid extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      elements: props.children.slice(0, 40),
    };
  }

  private loadMore = () => {
    const { elements } = this.state;
    const nextIndex: number = elements.length + 20;
    const nextGroup: any = this.props.children.slice(0, nextIndex);
    this.setState({ elements });
  };

  public render(): JSX.Element {
    const { classes, children, containerHeight, elementHeight } = this.props;
    const { elements } = this.state;
    const sizes = [
      { columns: 1, gutter: 10 },
      { mq: '690px', columns: 2, gutter: 10 },
      { mq: '870px', columns: 3, gutter: 10 },
      { mq: '1050px', columns: 4, gutter: 10 },
      { mq: '1230px', columns: 5, gutter: 10 },
      { mq: '1410px', columns: 6, gutter: 10 },
      { mq: '1590px', columns: 7, gutter: 10 },
    ];

    return (
      <div style={{ height: '700px', overflow: 'auto' }}>
        <MasonryInfiniteScroller
          sizes={sizes}
          pageStart={0}
          hasMore={elements.length <= this.props.children.length}
          loadMore={this.loadMore}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}
          style={{ marginLeft: '25px' }}
          threshhold={400}
        >
          {elements}
        </MasonryInfiniteScroller>
      </div>
    );
  }
}

export default styles<any>(Grid);
