
import { iFIA } from "../genesis-block";
import { Ignoto } from "../Intencion";
import { agentMessage } from "../agentMessage";
import { i18 } from "../i18/aleph-script-i18"
import { IMundo } from '../mundos/mundo';

export type TestResult = Ignoto;
export type Test = (tested: iFIA) => TestResult;

export interface ITuringTest {

    tested: iFIA;

    test: Test
}

export class TuringTester implements ITuringTest {

    tested: iFIA;

    constructor() {}

    test = (tested: iFIA) => {


        console.log(agentMessage(tested.nombre, i18.TURING.TEST_START_LABEL));
        console.log(agentMessage(i18.TURING.AGENT, i18.TURING.TEST_LABEL));
        const accion = tested
            .razona(i18.TURING.TEST_LABEL as unknown as IMundo, "Test");

        const veredicto = accion == "Sí" ? accion as TestResult : "No";
        console.log(agentMessage(tested.nombre, veredicto));

        console.log(agentMessage(i18.TURING.AGENT, i18.TURING.TEST_STOP_LABEL))

        return "";
    }

}