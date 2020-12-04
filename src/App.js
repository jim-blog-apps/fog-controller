import React, {Component, createRef} from 'react';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArduinoButton from 'components/ArduinoButton';
import TuneDialog from 'components/TuneDialog';
import AlertDialog from 'components/AlertDialog';
import Grid from '@material-ui/core/Grid';
import Led from 'components/Led';
import 'App.css';
import axios from 'axios';

const fs = require('fs-extra')
const os = require('os');

class App extends Component {
    constructor(props) {
        super(props);

        this.props.i18n.changeLanguage('fr');
        const { t } = this.props;

        this.state = {
            settings: {
                name: t('Fog Machine'),
                arduinoIpAddress: '',
                T1: 10,
                N: 2,
                T2: 5,
                T3: 5
            },
            machine: {
                power: 1,
                fog: 0
            },
            status: "",
        };

        this.alertRef = createRef()
        this.timer = null;

        //console.log(os.homedir());
        const settings_path = os.homedir() + "\\AppData\\Local\\fog_settings.json"

        if (fs.existsSync(settings_path)) {
            const settings = fs.readJsonSync(settings_path, {throws: false})
            if (settings) {
                //console.log(settings)
                this.state.settings = settings;
            }
        }

        if (!this.state.settings.arduinoIpAddress) {
            this.state.status = "Arduino IP address is missing";
        }
    }

    componentDidMount() {
        nw.Window.get().showDevTools();
        if (this.state.settings.arduinoIpAddress) {
            this.requestArduinoApi();
            console.log('CREATE TIMER');
            this.timer = setInterval(() => {
                    this.requestArduinoApi();
                },
                30 * 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    handleFogOffClicked(e) {
        console.log('handlePowerOffClicked');
        this.requestArduinoApi('fog', 0)
    }

    handleFogOnClicked(e) {
        console.log('handlePowerOnClicked');
        this.requestArduinoApi('fog', 1)
    }

    handlePowerOffClicked(e) {
        console.log('handlePowerOffClicked');
        this.requestArduinoApi('power', 0)
    }

    handlePowerOnClicked(e) {
        console.log('handlePowerOnClicked');
        this.requestArduinoApi('power', 1)
    }

    requestArduinoApi(service="", value="") {
        console.log('requestArduinoApi', service, value);
        axios.get(String(value).length > 0 ? `//${this.state.settings.arduinoIpAddress}/${service}/${value}`
                                                : `//${this.state.settings.arduinoIpAddress}/${service}`,
            {timeout: 3000})
            .then((response) => {
                console.log(response);
                const prevState = this.state
                if (response.status === 200) {
                    let result = response.data.match(/(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)/);
                    if (result && result.length === 7) {
                        prevState.settings.T1 = parseInt(result[1]);
                        prevState.settings.N = parseInt(result[2]);
                        prevState.settings.T2 = parseInt(result[3]);
                        prevState.settings.T3 = parseInt(result[4]);
                        prevState.machine.power = parseInt(result[5]);
                        prevState.machine.fog = parseInt(result[6]);
                        prevState.status = "";
                    } else {
                        prevState.status = "Error: unexpected answer @" + this.state.settings.arduinoIpAddress;
                    }
                } else {
                    prevState.status = "Error: " + response.status + response.statusText + " @" + this.state.settings.arduinoIpAddress;
                }
                this.setState(prevState); // => render
            }, (error) => {
                console.log(error);
                const prevState = this.state
                prevState.status = "Network error: " + error.message + " @" + this.state.settings.arduinoIpAddress;
                this.alertRef.current.handleClickOpen("Warning", prevState.status);
                this.setState(prevState); // => render
            });
    }

    render() {
        const { t } = this.props;
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.settings.name}
                    <Box className={"App-status-box"}>
                        {this.state.status}
                    </Box>
                </header>
                <div className="App-panel">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <Led className="Led"
                                 alt="power"
                                 label={t('POWER')}
                                 state={this.state.machine.power}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Led className="Led"
                                 alt="fog"
                                 label={t('FOG')}
                                 state={this.state.machine.fog}
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
                                               onClick={this.handlePowerOnClicked.bind(this)}>
                                    {t('POWER ON')}
                                </ArduinoButton>
                        </Grid>
                        <Grid item xs={6}>
                            <ArduinoButton state={this.state}
                                           onClick={this.handlePowerOffClicked.bind(this)}>
                                {t('POWER OFF')}
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
                                           onClick={this.handleFogOnClicked.bind(this)}>
                                {t('FOG ON')}
                            </ArduinoButton>
                        </Grid>
                        <Grid item xs={6}>
                            <ArduinoButton state={this.state}
                                           onClick={this.handleFogOffClicked.bind(this)}>
                                {t('FOG OFF')}
                            </ArduinoButton>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <p></p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} padding={10} alignItems="center">
                        <Grid item xs={9}>
                            <ArduinoButton tooltip={
                                <React.Fragment>
                                    <Typography color="inherit">Start Arduino fog sequence</Typography>
                                    <hr/>
                                    The fog sequence is controlled by the Arduino <em>onboard</em> sketch
                                </React.Fragment>
                            }
                                           state={this.state}
                                           onClick={this.handleFogOnClicked.bind(this)}>
                                start arduino fog program
                            </ArduinoButton>
                        </Grid>
                        <Grid item xs={3}>
                            <ArduinoButton tooltip={
                                <React.Fragment>
                                    <Typography color="inherit">Stop Arduino fog sequence</Typography>
                                </React.Fragment>
                            }
                                           state={this.state}
                                           onClick={this.handleFogOffClicked.bind(this)}>
                                stop
                            </ArduinoButton>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <p></p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} padding={10} alignItems="center">
                        <Grid item xs={9}>
                            <Button state={this.state}
                                    color="primary"
                                    onClick={this.handleFogOnClicked.bind(this)}>
                                start fog program
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button state={this.state}
                                    color="primary"
                                    onClick={this.handleFogOffClicked.bind(this)}>
                                stop
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <p></p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} padding={10} alignItems="center">
                        <Grid item xs={6}>
                            <TuneDialog
                                settings={this.state.settings}
                                onChange={(e) => {
                                    const prevState = this.state;
                                    if (this.state.settings.arduinoIpAddress) {
                                        prevState.status = "";
                                        this.requestArduinoApi();
                                        console.log('RECREATE TIMER');
                                        clearInterval(this.timer);
                                        this.timer = setInterval(() => {
                                                this.requestArduinoApi();
                                            },
                                            30 * 1000);
                                    } else {
                                        prevState.status = "Arduino IP address is missing";
                                    }
                                    this.setState(prevState)
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <AlertDialog
                                ref={ this.alertRef}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                            </AlertDialog>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

const AppI18n = withTranslation()(App)

// i18n translations might still be loaded by the http backend
// use react's Suspense
export default AppI18n;