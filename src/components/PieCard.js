/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Pie as PieChart } from 'react-chartjs-2';
import { DotLoader as Loader } from 'halogenium';
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

    const detail = (color, text) => (
      <span style={{ color: color }}>{text}</span>
    );

    return (
      <div
        onClick={() => this.setState({ showSum: !this.state.showSum })}
        style={sumStyle}
      >
        <span style={{ marginRight: 5 }}>Number of lines:</span>
        {this.state.showSum ? (
          all
        ) : (
          <div>
            {detail(color.invalid, invalid)} / {detail(color.valid, valid)} /
            {detail(color.expiring, expiring)}
          </div>
        )}
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

    const pieData = {
      labels: [segmentName('valid'), segmentName('expiring')],
      datasets: [
        {
          data: [valid, expiring],
          backgroundColor: [color.highlight.valid, color.highlight.expiring],
          hoverBackgroundColor: [color.valid, color.expiring]
        }
      ]
    };

    for (let i in dynamic) {
      let category = dynamic[i];
      let numDays = category.numDaysAtLeastValid;
      let length = category.lineNumbers.length;

      pieData.labels.push(segmentName('dynamic', numDays));
      pieData.datasets[0].data.push(length);
      pieData.datasets[0].backgroundColor.push(segmentColor(numDays));
      pieData.datasets[0].hoverBackgroundColor.push(segmentColor(numDays, 20));
    }

    pieData.labels.push(segmentName('invalid'));
    pieData.datasets[0].data.push(invalid);
    pieData.datasets[0].backgroundColor.push(color.highlight.invalid);
    pieData.datasets[0].hoverBackgroundColor.push(color.invalid);

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
          {this.props.hideHeader ? null : (
            <div
              style={{
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 5,
                textOverflow: 'ellipses',
                whiteSpace: 'nowrap'
              }}
            >
              {provider.name}
            </div>
          )}
          <PieChart
            style={{ marginTop: 0 }}
            getElementAtEvent={([element]) => {
              this.props.handlePieOnClick(element, provider.id);
            }}
            data={pieData}
            width={100}
            height={100}
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
