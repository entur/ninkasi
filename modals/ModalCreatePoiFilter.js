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
        const url = window.config.poiFilterBaseUrl;
        fetch(url)
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

    handleSubmit() {
        const endpoint = window.config.poiFilterBaseUrl;
        fetch(endpoint, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({key:'poiFilter', value: this.state.poi_value})
        })
            .then(() => {
                //TODO
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { isModalOpen} = this.props;


        const actions = [
            <FlatButton
                label="Close"
                onClick={this.handleOnClose.bind(this)}
            />,
            <FlatButton
                label="Update"
                onClick={this.handleSubmit.bind(this)}
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


                    <TextField
                        hintText="Name"
                        floatingLabelText="Name"
                        value={this.state.poi_value}
                        onChange={(e, value) =>
                            this.setState({
                                poi_value: value
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

