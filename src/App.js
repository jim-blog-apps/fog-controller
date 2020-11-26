import React, {Component} from 'react';
import ArduinoButton from 'components/ArduinoButton';
import TuneDialog from 'components/TuneDialog';
import Grid from "@material-ui/core/Grid";
import Led from 'components/Led';
import 'App.css';

const fs = require('fs-extra')

class App extends Component {
    state = {
        settings: {
            name: 'Fog Machine',
            arduinoIpAddress: '192.168.1.201',
            T1: 10,
            N: 2,
            T2: 5,
            T3: 5
        },
        prop: {
            power: 1,
            fog: 0
        }
    };

    render() {
        return (
            <div className="App">
                <header className="App-header" state={this.state}>
                    {this.state.settings.name}
                </header>
                <div className="App-panel">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <Led className="Led"
                                 alt="power"
                                 label="POWER"
                                 state={this.state.prop.power}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Led className="Led"
                                 alt="fog"
                                 label="FOG"
                                 state={this.state.prop.fog}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <p></p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <ArduinoButton state={this.state}
                                           onClick={() => alert(this.state.settings.arduinoIpAddress)}>
                                POWER ON
                            </ArduinoButton>
                        </Grid>
                        <Grid item xs={6}>
                            <ArduinoButton state={this.state}
                                           onClick={() => alert(this.state.settings.arduinoIpAddress)}>
                                POWER OFF
                            </ArduinoButton>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <p></p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} padding={10} alignItems="center">
                        <Grid item xs={6}>
                            <ArduinoButton state={this.state}
                                           onClick={() => alert(this.state.settings.arduinoIpAddress)}>
                                SPIT ON
                            </ArduinoButton>
                        </Grid>
                        <Grid item xs={6}>
                            <ArduinoButton state={this.state}
                                           onClick={() => alert(this.state.settings.arduinoIpAddress)}>
                                SPIT OFF
                            </ArduinoButton>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <p></p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} padding={10} alignItems="center">
                        <Grid item xs={6}>
                            <TuneDialog title={""} state={this.state}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }

    componentDidMount() {
        if (fs.existsSync('settings.json')) {
            //let content = fs.readFileSync('settings.json', "utf8");
            //alert(content);
            fs.readJson('settings.json', {throws: false})
                .then(obj => {
                    console.log(obj)
                })
                .catch(err => {
                    console.error(err)
                })
        } else {
            alert("no settings...");
        }
    }
}

export default App;
