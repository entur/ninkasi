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

import React from "react";
import PieCard from "../components/PieCard";
import SuppliersActions from "../actions/SuppliersActions";
import LineStatsCard from "./LineStatsCard";
import { segmentName, segmentName2Key } from "bogu/utils";

class StatisticsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProvider: false
    };
  }

  handlePieOnClick(element, provider) {
    if (element) {
      let clickedSegmentLabel = element._model.label;
      let selected = segmentName2Key(clickedSegmentLabel);

      this.setState({
        selectedSegment: selected.segment,
        daysValid: selected.daysValid,
        selectedProvider: provider
      });
    }
  }

  handleShowAll(value, provider) {
    this.setState({
      selectedSegment: "all",
      daysValid: 180,
      selectedProvider: provider
    });
  }

  handleClose() {
    this.setState({
      selectedProvider: false
    });
  }

  componentDidMount() {
    if (window.location.search.indexOf("?tab=2") > -1) {
      this.props.dispatch(SuppliersActions.getAllLineStats());
    }
  }

  render() {
    const { suppliers, lineStats } = this.props;
    const { selectedProvider, selectedSegment, daysValid } = this.state;

    const title = segmentName(selectedSegment, daysValid);

    if (selectedProvider) {
      const provider = suppliers.filter(
        provider => provider.id == selectedProvider
      )[0];

      return (
        <LineStatsCard
          handleClose={this.handleClose.bind(this)}
          daysValid={daysValid}
          selectedSegment={this.state.selectedSegment}
          title={`${provider.name} - ${title}`}
          stats={lineStats[selectedProvider]}
        />
      );
    } else {
      const providerPies = suppliers.map((supplier, index) => (
        <PieCard
          provider={supplier}
          key={"supplier-pie" + index}
          providerName={supplier.name}
          handleShowAllClick={this.handleShowAll.bind(this)}
          handlePieOnClick={this.handlePieOnClick.bind(this)}
          stats={lineStats[supplier.id]}
        />
      ));

      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around"
          }}
        >
          {providerPies}
        </div>
      );
    }
  }
}

export default StatisticsDetails;
