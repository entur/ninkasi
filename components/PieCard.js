import React, { PropTypes } from 'react';
import { Pie as PieChart } from 'react-chartjs';
import Loader from 'halogen/DotLoader';
import { segmentName, segmentColor } from 'bogu/utils';
import { color } from 'bogu/styles';

class PieCard extends React.Component {
  static propTypes = {
    handlePieOnClick: PropTypes.func.isRequired,
    handleshowAllClick: PropTypes.func,
    provider: PropTypes.object.isRequired
  };

  state = {
    showSum: true
  };

  renderNumber(all, valid, invalid, expiring) {
    const sumStyle = {
      color: color.font.info2,
      fontWeight: 400,
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'none'
    };

    const detail = (color, text) =>
      <span style={{ color: color }}>{text}</span>;

    return (
      <div
        onClick={() => this.setState({ showSum: !this.state.showSum })}
        style={sumStyle}
      >
        <span style={{marginRight: 5}}>Number of lines:</span>
        {this.state.showSum
          ? all
          : <div>
              {detail(color.invalid, invalid)} / {detail(color.valid, valid)} /
              {detail(color.expiring, expiring)}
            </div>}
      </div>
    );
  }

  render() {
    const showAllStyle = {
      color: 'rgb(17, 105, 167)',
      fontWeight: 600,
      textDecoration: 'underline',
      cursor: 'pointer',
      marginTop: 10,
      textAlign: 'center'
    };

    const pieOptions = {
      animation: false,
      showTooltips: true,
      responsive: true,
      tooltipTemplate: '<%= label %> - <%= value %>',
      cursor: 'pointer'
    };

    const { stats, provider } = this.props;

    if (typeof stats === 'undefined')
      return (
        <div
          style={{
            width: 200,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            margin: 20
          }}
        >
          <Loader color={color.font.info1} size="23px" />
        </div>
      );

    const all = stats.all.lineNumbers.length;
    const valid = stats.valid.lineNumbers.length;
    const invalid = stats.invalid.lineNumbers.length;
    const expiring = stats.expiring.lineNumbers.length;
    const dynamic = [];

    const pieData = [
      {
        value: valid,
        highlight: color.valid,
        color: color.highlight.valid,
        label: segmentName('valid')
      },
      {
        value: expiring,
        color: color.expiring,
        highlight: color.highlight.expiring,
        label: segmentName('expiring')
      }
    ];

    for (let i in dynamic) {
      let category = dynamic[i];
      let numDays = category.numDaysAtLeastValid;
      let length = category.lineNumbers.length;

      pieData.push({
        value: length,
        color: segmentColor(numDays),
        highlight: segmentColor(numDays, 20),
        label: segmentName('dynamic', numDays)
      });
    }
    pieData.push({
      value: invalid,
      color: color.invalid,
      highlight: color.highlight.invalid,
      label: segmentName('invalid')
    });

    return (
      <div
        style={{
          width: 200,
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          margin: 10
        }}
      >
        <div>
          {this.props.hideHeader
            ? null
            : <div
                style={{
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: 5,
                  textOverflow: 'ellipses',
                  whiteSpace: 'nowrap'
                }}
              >
                {provider.name}
              </div>}
          <PieChart
            style={{ marginTop: 0 }}
            ref="chart"
            onClick={e => {
              this.props.handlePieOnClick(
                e,
                this.refs.chart.getChart(),
                provider.id
              );
            }}
            data={pieData}
            width="100"
            height="100"
            options={pieOptions}
          />
          {this.renderNumber(all, valid, invalid, expiring)}
          <div
            onClick={() => this.props.handleShowAllClick(120, provider.id)}
            style={showAllStyle}
          >
            Show all
          </div>
        </div>
      </div>
    );
  }
}
export default PieCard;
