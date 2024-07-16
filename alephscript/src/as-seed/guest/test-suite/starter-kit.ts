import { ITestSuit, TestSuite } from "./test-suite";

export type ITestResult = any;

export interface IStarterKit extends ITestSuit {

    AlephScriptInstance(): ITestResult;

    firstLaunch(): ITestResult;

    AppStatus():  ITestResult;

}

export class StarterKit extends TestSuite implements IStarterKit {

    AlephScriptInstance(): ITestResult {

        let result: ITestResult;

        return result;
    }

    firstLaunch(): ITestResult {

        let result: ITestResult;

        return result;
    }

    AppStatus(): ITestResult {
        let result: ITestResult;

        return result;
    }

}