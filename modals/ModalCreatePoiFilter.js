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

import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from "material-ui/TextField";
import Modal from 'material-ui/Dialog';

const initialState = {
    poiFilter: {
        filter_value: ''
    }
};

class ModalCreatePoiFilter extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillUnmount() {
        this.state = {
            initialState,
            poi_value: '',
        };
    }

    componentDidMount() {
        fetch('http://localhost:28080/services/custom_configurations/poiFilter')
            .then(results => {
                return results.json();
            }).then(data => {
                let poi_value = data.value
            this.setState({poi_value: poi_value})
            console.log("state", this.state.poi_value)

        })
    }

    handleOnClose() {
        this.setState(initialState);
        this.props.handleCloseModal();
    }

    render() {
        const { isModalOpen, handleSubmit} = this.props;

        const { poiFilter } = this.state;

        const titleStyle = {
            fontSize: '2em',
            fontWeight: 600,
            margin: '10px auto',
            width: '80%'
        };


        const actions = [
            <FlatButton
                label="Close"
                onClick={this.handleOnClose.bind(this)}
            />,
            <FlatButton
                label="Create"
                onClick={() => handleSubmit(poiFilter)}
            />
        ];

        return (
            <Modal
                open={isModalOpen}
                actions={actions}
                contentStyle={{ width: '30%' }}
                title="Create a new poi filter"
                onRequestClose={() => this.handleOnClose()}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >


            {/*        <TextField
                        hintText="POI Filter"
                        floatingLabelText="POI Filter value"
                        value={this.state.poi_value}
                        //value={poiFilter.filter_value}

                        fullWidth={true}
                    />
*/}
                    <TextField
                        hintText="Name"
                        floatingLabelText="Name"
                        value={this.state.poi_value}
                        onChange={(e, value) =>
                            this.setState({
                                poiFilter: {
                                    ...poiFilter,
                                    filter_value: value
                                }
                            })}
                        fullWidth={true}
                        style={{ marginTop: -20 }}
                    />

                </div>
            </Modal>
        );
    }
}
export default ModalCreatePoiFilter;

